import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { resolveProjectPath } from "./sources";
import type { NewsletterArticle } from "../types";

export interface WeeklyDigest {
  week: string;
  collectedAt: string;
  windowStart: string;
  windowEnd: string;
  articles: NewsletterArticle[];
}

const WEEKLY_DIR = "content/curated/weekly";

export async function saveWeeklyDigest(digest: WeeklyDigest): Promise<string> {
  const directory = resolveProjectPath(WEEKLY_DIR);
  await mkdir(directory, { recursive: true });
  const path = join(directory, `${digest.week}.json`);
  await writeFile(path, `${JSON.stringify(digest, null, 2)}\n`, "utf8");
  return path;
}

export async function loadRecentWeeklyDigests(now = new Date()): Promise<WeeklyDigest[]> {
  const directory = resolveProjectPath(WEEKLY_DIR);

  try {
    const names = await readdir(directory);
    const digests = await Promise.all(
      names
        .filter((name) => /^\d{4}-W\d{2}\.json$/.test(name))
        .map(async (name) => JSON.parse(await readFile(join(directory, name), "utf8")) as WeeklyDigest)
    );

    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    return digests
      .filter((digest) => overlapsWindow(digest, monthStart, nextMonthStart))
      .sort((first, second) => first.week.localeCompare(second.week));
  } catch {
    return [];
  }
}

export function getCurrentWeeklyWindow(now = new Date()): { week: string; windowStart: Date; windowEnd: Date } {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = date.getUTCDay() || 7;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - day + 1);
  const nextMonday = new Date(monday);
  nextMonday.setUTCDate(monday.getUTCDate() + 7);

  return {
    week: getIsoWeekKey(monday),
    windowStart: monday,
    windowEnd: nextMonday
  };
}

export function isPublishedWithin(article: NewsletterArticle, start: Date, end: Date): boolean {
  if (!article.publishedAt) {
    return false;
  }

  const published = new Date(article.publishedAt);
  return !Number.isNaN(published.getTime()) && published >= start && published < end;
}

function overlapsWindow(digest: WeeklyDigest, start: Date, end: Date): boolean {
  const digestStart = new Date(digest.windowStart);
  const digestEnd = new Date(digest.windowEnd);
  return digestStart < end && digestEnd > start;
}

function getIsoWeekKey(date: Date): string {
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  const weekOne = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((thursday.getTime() - weekOne.getTime()) / 86_400_000 - 3 + ((weekOne.getUTCDay() + 6) % 7)) / 7);
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
