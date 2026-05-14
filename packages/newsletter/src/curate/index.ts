import { refineRankingWithGemini } from "./gemini";
import { rankForRoboticsClub } from "./scoring";
import type { NewsletterArticle } from "../types";

export async function curateWeeklyArticles(articles: NewsletterArticle[], limit = 5): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return refineRankingWithGemini(ranked, limit);
}

export async function curateMonthlyArticles(articles: NewsletterArticle[], limit = 8): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return refineRankingWithGemini(ranked, limit);
}
