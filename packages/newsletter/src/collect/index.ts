import { sampleIssue } from "@newsletter/email-templates/sampleIssue";
import { collectManualArticles } from "./manual";
import { collectRssArticles, verifyRssSources } from "./rss";
import { loadSources, resolveProjectPath, type RssSource } from "./sources";
import type { NewsletterArticle } from "../types";

export async function collectArticles(): Promise<NewsletterArticle[]> {
  const sources = await loadSources();
  const markdownSources = sources.filter((source) => source.type === "markdown");
  const rssSources = sources.filter((source): source is RssSource => source.type === "rss");
  const [manualArticles, rssArticles] = await Promise.all([
    Promise.all(markdownSources.map((source) => collectManualArticles(resolveProjectPath(source.path)))),
    collectRssArticles(rssSources)
  ]);
  const articles = sortByPublishedDate(dedupeArticles([...manualArticles.flat(), ...rssArticles]));
  return articles.length > 0 ? articles : sampleIssue.articles;
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
