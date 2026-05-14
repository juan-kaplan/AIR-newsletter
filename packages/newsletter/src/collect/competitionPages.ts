import type { CompetitionPageSource } from "./sources";
import type { NewsletterArticle } from "../types";

export async function collectCompetitionPages(sources: CompetitionPageSource[], now = new Date()): Promise<NewsletterArticle[]> {
  const settled = await Promise.allSettled(sources.map((source) => collectCompetitionPage(source, now)));
  return settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function collectCompetitionPage(source: CompetitionPageSource, now: Date): Promise<NewsletterArticle[]> {
  const response = await fetch(source.url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "AIR Robotics Newsletter/0.1 (+https://github.com/jerecoder/AIR-newsletter)"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${source.url}`);
  }

  const html = await response.text();
  const text = cleanText(stripHtml(html));
  const title = extractTitle(html) ?? source.name;
  const deadlineSnippet = extractCompetitionSnippet(text);

  if (!deadlineSnippet) {
    return [];
  }

  return [
    {
      title,
      url: source.url,
      summary: deadlineSnippet,
      source: source.name,
      category: "competition",
      publishedAt: now.toISOString()
    }
  ];
}

function extractTitle(html: string): string | null {
  const heading = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  return heading ? cleanText(stripHtml(heading)) : null;
}

function extractCompetitionSnippet(text: string): string | null {
  const lower = text.toLowerCase();
  const anchors = ["registration", "deadline", "application", "apply", "team", "qualification", "challenge", "competition"];
  const index = anchors.map((anchor) => lower.indexOf(anchor)).filter((position) => position >= 0).sort((first, second) => first - second)[0];

  if (index === undefined) {
    return null;
  }

  const start = Math.max(0, index - 120);
  const end = Math.min(text.length, index + 360);
  return text.slice(start, end).replace(/\s+/g, " ").trim().slice(0, 320);
}

function stripHtml(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function cleanText(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
