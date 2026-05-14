import { XMLParser } from "fast-xml-parser";
import type { RssSource } from "./sources";
import type { NewsletterArticle } from "../types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

export async function collectRssArticles(sources: RssSource[]): Promise<NewsletterArticle[]> {
  const settled = await Promise.allSettled(sources.map((source) => collectRssSource(source)));
  return settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

export async function verifyRssSources(sources: RssSource[]): Promise<Array<{ key: string; ok: boolean; count: number; error?: string }>> {
  const settled = await Promise.allSettled(sources.map((source) => collectRssSource(source)));
  return settled.map((result, index) => {
    const source = sources[index];

    if (!source) {
      return { key: "unknown", ok: false, count: 0, error: "Missing source configuration." };
    }

    if (result.status === "rejected") {
      return { key: source.key, ok: false, count: 0, error: result.reason instanceof Error ? result.reason.message : "Unknown error" };
    }

    return { key: source.key, ok: result.value.length > 0, count: result.value.length };
  });
}

async function collectRssSource(source: RssSource): Promise<NewsletterArticle[]> {
  const response = await fetch(source.url, {
    headers: {
      accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      "user-agent": "AIR Robotics Newsletter/0.1 (+https://github.com/jerecoder/AIR-newsletter)"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${source.url}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml) as unknown;
  const entries = parseFeedEntries(parsed);
  const articles = entries
    .map((entry) => toNewsletterArticle(entry, source))
    .filter((article): article is NewsletterArticle => Boolean(article));

  return articles.slice(0, source.maxItems ?? 5);
}

interface FeedEntry {
  title?: unknown;
  link?: unknown;
  description?: unknown;
  summary?: unknown;
  pubDate?: unknown;
  published?: unknown;
  updated?: unknown;
  "content:encoded"?: unknown;
}

function parseFeedEntries(parsed: unknown): FeedEntry[] {
  if (!isRecord(parsed)) {
    return [];
  }

  const rssItems = parsed.rss;
  if (isRecord(rssItems) && isRecord(rssItems.channel)) {
    return asArray<FeedEntry>(rssItems.channel.item);
  }

  const feed = parsed.feed;
  if (isRecord(feed)) {
    return asArray<FeedEntry>(feed.entry);
  }

  return [];
}

function toNewsletterArticle(entry: FeedEntry, source: RssSource): NewsletterArticle | null {
  const title = cleanText(extractText(entry.title));
  const url = extractLink(entry.link);
  const rawSummary = extractText(entry.description) ?? extractText(entry.summary) ?? extractText(entry["content:encoded"]);
  const summary = cleanText(stripHtml(rawSummary ?? "")).slice(0, 260);
  const publishedAt = extractText(entry.pubDate) ?? extractText(entry.published) ?? extractText(entry.updated);

  if (!title || !url || !summary || roboticsRelevanceScore(`${title} ${summary}`) === 0) {
    return null;
  }

  return {
    title,
    url,
    summary,
    source: source.name,
    ...(publishedAt ? { publishedAt: normalizeDate(publishedAt) } : {})
  };
}

function roboticsRelevanceScore(value: string): number {
  const normalized = value.toLowerCase();
  const keywords = [
    "robot",
    "robotic",
    "robotics",
    "humanoid",
    "drone",
    "autonomous",
    "autonomy",
    "rover",
    "actuator",
    "gripper",
    "manipulation",
    "locomotion",
    "tactile",
    "cobot",
    "mechatronic",
    "embodied ai",
    "physical ai"
  ];

  return keywords.reduce((score, keyword) => (normalized.includes(keyword) ? score + 1 : score), 0);
}

function extractLink(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const alternate = value.find((item) => isRecord(item) && (item["@_rel"] === "alternate" || !item["@_rel"]));
    return isRecord(alternate) && typeof alternate["@_href"] === "string" ? alternate["@_href"] : null;
  }

  if (isRecord(value) && typeof value["@_href"] === "string") {
    return value["@_href"];
  }

  return null;
}

function extractText(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value) && typeof value["#text"] === "string") {
    return value["#text"];
  }

  return null;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function cleanText(value: string | null): string {
  return (value ?? "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function asArray<T>(value: unknown): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? (value as T[]) : [value as T];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
