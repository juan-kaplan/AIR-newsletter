import { XMLParser } from "fast-xml-parser";
import type { RssSource } from "./sources";
import type { NewsletterArticle } from "../types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

export async function collectRssArticles(
  sources: RssSource[],
): Promise<NewsletterArticle[]> {
  const settled = await Promise.allSettled(
    sources.map((source) => collectRssSource(source)),
  );
  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

export async function verifyRssSources(
  sources: RssSource[],
): Promise<Array<{ key: string; ok: boolean; count: number; error?: string }>> {
  const settled = await Promise.allSettled(
    sources.map((source) => collectRssSource(source)),
  );
  return settled.map((result, index) => {
    const source = sources[index];

    if (!source) {
      return {
        key: "unknown",
        ok: false,
        count: 0,
        error: "Missing source configuration.",
      };
    }

    if (result.status === "rejected") {
      return {
        key: source.key,
        ok: false,
        count: 0,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error",
      };
    }

    return {
      key: source.key,
      ok: result.value.length > 0,
      count: result.value.length,
    };
  });
}

async function collectRssSource(
  source: RssSource,
): Promise<NewsletterArticle[]> {
  const response = await fetch(source.url, {
    headers: {
      accept:
        "application/rss+xml, application/atom+xml, application/xml, text/xml",
      "user-agent":
        "AIR Robotics Newsletter/0.1 (+https://github.com/jerecoder/AIR-newsletter)",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${source.url}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml) as unknown;
  const entries = parseFeedEntries(parsed);
  const articles = (
    await Promise.all(
      entries.map(async (entry) => {
        const article = toNewsletterArticle(entry, source);
        if (!article) {
          return null;
        }

        return article.imageUrl ? article : withPageImage(article);
      }),
    )
  ).filter((article): article is NewsletterArticle => Boolean(article));

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
  enclosure?: unknown;
  "media:content"?: unknown;
  "media:thumbnail"?: unknown;
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

function toNewsletterArticle(
  entry: FeedEntry,
  source: RssSource,
): NewsletterArticle | null {
  const title = cleanText(extractText(entry.title));
  const url = extractLink(entry.link);
  const rawSummary =
    extractText(entry.description) ??
    extractText(entry.summary) ??
    extractText(entry["content:encoded"]);
  const summary = truncateSummary(cleanText(stripHtml(rawSummary ?? "")), 260);
  const publishedAt =
    extractText(entry.pubDate) ??
    extractText(entry.published) ??
    extractText(entry.updated);

  if (
    !title ||
    !url ||
    !summary ||
    roboticsRelevanceScore(`${title} ${summary}`) === 0
  ) {
    return null;
  }

  const imageUrl = extractFeedImageUrl(entry, url);

  return {
    title,
    url,
    summary,
    source: source.name,
    ...(source.category ? { category: source.category } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(publishedAt ? { publishedAt: normalizeDate(publishedAt) } : {}),
  };
}

async function withPageImage(
  article: NewsletterArticle,
): Promise<NewsletterArticle> {
  const imageUrl = await fetchPageImage(article.url);
  return imageUrl ? { ...article, imageUrl } : article;
}

async function fetchPageImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent":
          "AIR Robotics Newsletter/0.1 (+https://github.com/jerecoder/AIR-newsletter)",
      },
    });

    if (!response.ok) {
      return null;
    }

    return extractHtmlImageUrl(await response.text(), url);
  } catch {
    return null;
  }
}

function extractFeedImageUrl(
  entry: FeedEntry,
  articleUrl: string,
): string | null {
  return (
    extractMediaUrl(entry["media:content"], articleUrl) ??
    extractMediaUrl(entry["media:thumbnail"], articleUrl) ??
    extractEnclosureImageUrl(entry.enclosure, articleUrl) ??
    extractHtmlImageUrl(
      extractText(entry.description) ??
        extractText(entry.summary) ??
        extractText(entry["content:encoded"]) ??
        "",
      articleUrl,
    )
  );
}

function extractMediaUrl(value: unknown, baseUrl: string): string | null {
  const media = asArray<unknown>(value);
  for (const item of media) {
    if (isRecord(item) && typeof item["@_url"] === "string") {
      const imageUrl = normalizeImageUrl(item["@_url"], baseUrl);
      if (imageUrl) {
        return imageUrl;
      }
    }
  }

  return null;
}

function extractEnclosureImageUrl(
  value: unknown,
  baseUrl: string,
): string | null {
  const enclosures = asArray<unknown>(value);
  for (const item of enclosures) {
    if (!isRecord(item) || typeof item["@_url"] !== "string") {
      continue;
    }

    const type = typeof item["@_type"] === "string" ? item["@_type"] : "";
    if (type && !type.toLowerCase().startsWith("image/")) {
      continue;
    }

    const imageUrl = normalizeImageUrl(item["@_url"], baseUrl);
    if (imageUrl) {
      return imageUrl;
    }
  }

  return null;
}

export function extractHtmlImageUrl(
  html: string,
  baseUrl: string,
): string | null {
  const candidates = [
    ...extractMetaImageCandidates(html, baseUrl),
    ...extractInlineImageCandidates(html, baseUrl),
  ];
  const best = candidates.sort(
    (first, second) => second.score - first.score,
  )[0];
  return best && best.score >= 45 ? best.url : null;
}

interface ImageCandidate {
  url: string;
  score: number;
}

function extractMetaImageCandidates(
  html: string,
  baseUrl: string,
): ImageCandidate[] {
  return [
    { value: extractMetaContent(html, "property", "og:image"), baseScore: 80 },
    { value: extractMetaContent(html, "name", "twitter:image"), baseScore: 75 },
    {
      value: extractMetaContent(html, "property", "twitter:image"),
      baseScore: 75,
    },
  ].flatMap(({ value, baseScore }) => {
    const url = normalizeImageUrl(value, baseUrl);
    return url ? [{ url, score: scoreImageUrl(url, baseScore) }] : [];
  });
}

function extractInlineImageCandidates(
  html: string,
  baseUrl: string,
): ImageCandidate[] {
  return [...html.matchAll(/<img\b([^>]*)>/gi)].flatMap((match) => {
    const attrs = match[1] ?? "";
    const src = /\bsrc=["']([^"']+)["']/i.exec(attrs)?.[1];
    const url = normalizeImageUrl(src ?? null, baseUrl);
    if (!url) {
      return [];
    }

    const width = Number.parseInt(
      /\bwidth=["']?(\d+)/i.exec(attrs)?.[1] ?? "",
      10,
    );
    const height = Number.parseInt(
      /\bheight=["']?(\d+)/i.exec(attrs)?.[1] ?? "",
      10,
    );
    const sizeScore =
      Number.isFinite(width) && Number.isFinite(height)
        ? Math.min(30, Math.floor((width * height) / 40_000))
        : 0;
    return [{ url, score: scoreImageUrl(url, 45 + sizeScore) }];
  });
}

function scoreImageUrl(url: string, baseScore: number): number {
  const lower = url.toLowerCase();
  let score = baseScore;
  if (
    /\b(hero|banner|cover|featured|article|robot|drone|rover|challenge|team|competition)\b/.test(
      lower,
    )
  ) {
    score += 20;
  }
  if (
    [
      "logo",
      "icon",
      "sprite",
      "avatar",
      "placeholder",
      "blank",
      "favicon",
      "brand",
      "sponsor",
      "partner",
    ].some((token) => lower.includes(token))
  ) {
    score -= 45;
  }
  if (/\.(svg|ico)(?:\?|$)/.test(lower)) {
    score -= 30;
  }

  return score;
}

function extractMetaContent(
  html: string,
  attributeName: string,
  attributeValue: string,
): string | null {
  const attributeFirstPattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attributeName}=["']${escapeRegExp(attributeValue)}["'])(?=[^>]*\\bcontent=["']([^"']+)["'])[^>]*>`,
    "i",
  );
  const contentFirstPattern = new RegExp(
    `<meta\\b(?=[^>]*\\bcontent=["']([^"']+)["'])(?=[^>]*\\b${attributeName}=["']${escapeRegExp(attributeValue)}["'])[^>]*>`,
    "i",
  );
  return (
    attributeFirstPattern.exec(html)?.[1] ??
    contentFirstPattern.exec(html)?.[1] ??
    null
  );
}

function normalizeImageUrl(
  value: string | null,
  baseUrl: string,
): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(cleanText(value), baseUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
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
    "physical ai",
  ];

  return keywords.reduce(
    (score, keyword) => (normalized.includes(keyword) ? score + 1 : score),
    0,
  );
}

function extractLink(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    const alternate = value.find(
      (item) =>
        isRecord(item) && (item["@_rel"] === "alternate" || !item["@_rel"]),
    );
    return isRecord(alternate) && typeof alternate["@_href"] === "string"
      ? alternate["@_href"]
      : null;
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
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSummary(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const sentenceEnd = Math.max(
    value.lastIndexOf(". ", maxLength),
    value.lastIndexOf("? ", maxLength),
    value.lastIndexOf("! ", maxLength),
  );
  if (sentenceEnd >= 120) {
    return value.slice(0, sentenceEnd + 1).trim();
  }

  return `${value
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim()}...`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
