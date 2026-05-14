import type { CompetitionPageSource } from "./sources";
import { extractHtmlImageUrl } from "./rss";
import type { NewsletterArticle } from "../types";

export async function collectCompetitionPages(
  sources: CompetitionPageSource[],
  now = new Date(),
): Promise<NewsletterArticle[]> {
  const settled = await Promise.allSettled(
    sources.map((source) => collectCompetitionPage(source, now)),
  );
  return settled.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

async function collectCompetitionPage(
  source: CompetitionPageSource,
  now: Date,
): Promise<NewsletterArticle[]> {
  const response = await fetch(source.url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent":
        "AIR Robotics Newsletter/0.1 (+https://github.com/jerecoder/AIR-newsletter)",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while fetching ${source.url}`);
  }

  const html = await response.text();
  const text = cleanText(stripHtml(html));
  const title = extractTitle(html) ?? source.name;
  const deadlineSnippet = extractCompetitionSnippet(text, now);
  const imageUrl = extractHtmlImageUrl(html, source.url);

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
      ...(imageUrl ? { imageUrl } : {}),
      publishedAt: now.toISOString(),
    },
  ];
}

function extractTitle(html: string): string | null {
  const heading =
    /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ??
    /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  return heading ? cleanText(stripHtml(heading)) : null;
}

function extractCompetitionSnippet(text: string, now: Date): string | null {
  const lower = text.toLowerCase();
  const anchors = [
    "registration",
    "deadline",
    "application",
    "apply",
    "team",
    "qualification",
    "challenge",
    "competition",
  ];
  const snippets = anchors
    .flatMap((anchor) => findAnchorPositions(lower, anchor))
    .sort((first, second) => first - second)
    .map((index) => getSnippet(text, index));

  if (snippets.length === 0) {
    return null;
  }

  if (
    /\b(registration|grant application|applications?)\b.{0,80}\b(now closed|closed)\b/i.test(
      text,
    )
  ) {
    return null;
  }

  const deadlineSnippets = snippets.filter(hasDeadlineSignal);
  const datedDeadlineSnippets = deadlineSnippets
    .map((snippet) => ({ snippet, dates: extractDates(snippet, now) }))
    .filter((item) => item.dates.length > 0);

  if (
    datedDeadlineSnippets.length > 0 &&
    !datedDeadlineSnippets.some((item) =>
      item.dates.some((date) => isFutureOrToday(date, now)),
    )
  ) {
    return null;
  }

  const opportunitySnippets = snippets.filter(isOpportunitySnippet);
  const candidateSnippets =
    opportunitySnippets.length > 0 ? opportunitySnippets : snippets;
  const datedSnippets = candidateSnippets
    .map((snippet) => ({ snippet, dates: extractDates(snippet, now) }))
    .filter((item) => item.dates.length > 0);
  const futureDatedSnippet = datedSnippets.find((item) =>
    item.dates.some((date) => isFutureOrToday(date, now)),
  );

  if (datedSnippets.length > 0 && !futureDatedSnippet) {
    return null;
  }

  return (
    (futureDatedSnippet?.snippet ?? candidateSnippets[0] ?? null)?.slice(
      0,
      320,
    ) ?? null
  );
}

function findAnchorPositions(text: string, anchor: string): number[] {
  const positions: number[] = [];
  let start = 0;

  while (start < text.length) {
    const index = text.indexOf(anchor, start);
    if (index === -1) {
      return positions;
    }

    positions.push(index);
    start = index + anchor.length;
  }

  return positions;
}

function getSnippet(text: string, index: number): string {
  const start = Math.max(0, index - 140);
  const end = Math.min(text.length, index + 420);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function isOpportunitySnippet(snippet: string): boolean {
  return /\b(deadline|registration|applications?|apply|proposal|submission|qualification)\b/i.test(
    snippet,
  );
}

function hasDeadlineSignal(snippet: string): boolean {
  return /\b(deadline|registration deadline|applications? deadline|submission deadline|qualification deadline)\b/i.test(
    snippet,
  );
}

function extractDates(text: string, now: Date): Date[] {
  return [...extractMonthFirstDates(text, now), ...extractDayFirstDates(text)];
}

function extractMonthFirstDates(text: string, now: Date): Date[] {
  const dates: Date[] = [];
  const pattern =
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?/gi;
  for (const match of text.matchAll(pattern)) {
    const month = monthIndex(match[1] ?? "");
    const day = Number.parseInt(match[2] ?? "", 10);
    const year = Number.parseInt(match[3] ?? `${now.getUTCFullYear()}`, 10);
    if (month >= 0 && Number.isFinite(day)) {
      dates.push(new Date(Date.UTC(year, month, day)));
    }
  }

  return dates;
}

function extractDayFirstDates(text: string): Date[] {
  const dates: Date[] = [];
  const pattern =
    /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?,?\s*(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi;
  for (const match of text.matchAll(pattern)) {
    const day = Number.parseInt(match[1] ?? "", 10);
    const month = monthIndex(match[2] ?? "");
    const year = Number.parseInt(match[3] ?? "", 10);
    if (month >= 0 && Number.isFinite(day) && Number.isFinite(year)) {
      dates.push(new Date(Date.UTC(year, month, day)));
    }
  }

  return dates;
}

function isFutureOrToday(date: Date, now: Date): boolean {
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  return date >= today;
}

function monthIndex(value: string): number {
  return [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ].indexOf(value.toLowerCase());
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
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
