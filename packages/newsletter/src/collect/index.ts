import { sampleIssue } from "@newsletter/email-templates/sampleIssue";
import { curateMonthlyArticles, curateWeeklyArticles } from "../curate";
import { collectCompetitionPages } from "./competitionPages";
import { collectManualArticles } from "./manual";
import { collectRssArticles, verifyRssSources } from "./rss";
import { loadSources, resolveProjectPath, type CompetitionPageSource, type RssSource } from "./sources";
import { getCurrentWeeklyWindow, isPublishedWithin, loadRecentWeeklyDigests, saveWeeklyDigest } from "./weeklyStore";
import type { NewsletterArticle } from "../types";

export async function collectArticles(now = new Date()): Promise<NewsletterArticle[]> {
  const weeklyDigests = await loadRecentWeeklyDigests(now);
  if (weeklyDigests.length > 0) {
    return curateMonthlyArticles(weeklyDigests.flatMap((digest) => digest.articles), 8);
  }

  return collectLiveMonthlyArticles();
}

export async function collectLiveMonthlyArticles(): Promise<NewsletterArticle[]> {
  const articles = await collectSourceArticles();
  return articles.length > 0 ? articles : sampleIssue.articles;
}

async function collectSourceArticles(): Promise<NewsletterArticle[]> {
  const sources = await loadSources();
  const markdownSources = sources.filter((source) => source.type === "markdown");
  const rssSources = sources.filter((source): source is RssSource => source.type === "rss");
  const competitionPageSources = sources.filter((source): source is CompetitionPageSource => source.type === "competition_page");
  const [manualArticles, rssArticles, competitionArticles] = await Promise.all([
    Promise.all(markdownSources.map((source) => collectManualArticles(resolveProjectPath(source.path)))),
    collectRssArticles(rssSources),
    collectCompetitionPages(competitionPageSources)
  ]);
  const articles = sortByPublishedDate(dedupeArticles([...manualArticles.flat(), ...rssArticles, ...competitionArticles]));
  return articles;
}

export async function collectAndStoreWeeklyDigest(now = new Date()) {
  const { week, windowStart, windowEnd } = getCurrentWeeklyWindow(now);
  const articles = (await collectSourceArticles()).filter((article) => isPublishedWithin(article, windowStart, windowEnd));
  const curatedArticles = await curateWeeklyArticles(dedupeArticles(articles), 5);
  const path = await saveWeeklyDigest({
    week,
    collectedAt: now.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    articles: curatedArticles
  });

  return { path, week, articles: curatedArticles };
}

export async function verifyCollectionSources() {
  const sources = await loadSources();
  return verifyRssSources(sources.filter((source): source is RssSource => source.type === "rss"));
}

function dedupeArticles(articles: NewsletterArticle[]): NewsletterArticle[] {
  const seenUrls = new Set<string>();
  return articles.filter((article) => {
    if (seenUrls.has(article.url)) {
      return false;
    }

    seenUrls.add(article.url);
    return true;
  });
}

function sortByPublishedDate(articles: NewsletterArticle[]): NewsletterArticle[] {
  return [...articles].sort((first, second) => {
    const firstTime = first.publishedAt ? new Date(first.publishedAt).getTime() : 0;
    const secondTime = second.publishedAt ? new Date(second.publishedAt).getTime() : 0;
    return secondTime - firstTime;
  });
}
