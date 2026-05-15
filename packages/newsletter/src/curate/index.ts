import { refineRankingWithGemini } from "./gemini";
import { runPublishingSweeps } from "./publishingSweeps";
import { rankForRoboticsClub } from "./scoring";
import type { NewsletterArticle } from "../types";

export async function curateWeeklyArticles(
  articles: NewsletterArticle[],
  limit = 6,
  env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return runPublishingSweeps(await refineRankingWithGemini(ranked, limit, env));
}

export async function curateMonthlyArticles(
  articles: NewsletterArticle[],
  limit = 10,
  env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterArticle[]> {
  const ranked = rankForRoboticsClub(articles, Math.max(limit * 3, limit));
  return runPublishingSweeps(await refineRankingWithGemini(ranked, limit, env));
}
