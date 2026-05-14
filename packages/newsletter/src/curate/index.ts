import { refineRankingWithGemini } from "./gemini";
import { rankForRoboticsClub } from "./scoring";
import type { NewsletterArticle } from "../types";

export async function curateWeeklyArticles(articles: NewsletterArticle[], limit = 5, env: NodeJS.ProcessEnv = process.env): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return refineRankingWithGemini(ranked, limit, env);
}

export async function curateMonthlyArticles(articles: NewsletterArticle[], limit = 8, env: NodeJS.ProcessEnv = process.env): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return refineRankingWithGemini(ranked, limit, env);
}
