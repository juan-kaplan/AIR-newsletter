import { sampleIssue } from "@newsletter/email-templates/sampleIssue";
import { collectManualArticles } from "./manual";
import { collectRssArticles } from "./rss";
import type { NewsletterArticle } from "../types";

export async function collectArticles(): Promise<NewsletterArticle[]> {
  const [manualArticles, rssArticles] = await Promise.all([collectManualArticles(), collectRssArticles()]);
  const articles = [...manualArticles, ...rssArticles];
  return articles.length > 0 ? articles : sampleIssue.articles;
}
