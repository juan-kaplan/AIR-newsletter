import { runPublishingSweeps } from "./publishingSweeps";
import { rankForAirClub } from "./scoring";
import type { NewsletterArticle } from "../types";

export async function curateWeeklyArticles(
  articles: NewsletterArticle[],
  limit = 6,
  _env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterArticle[]> {
  void _env;
  const ranked = rankForAirClub(articles, limit);
  return runPublishingSweeps(ranked);
}

export async function curateMonthlyArticles(
  articles: NewsletterArticle[],
  limit = 10,
  _env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterArticle[]> {
  void _env;
  const ranked = rankForAirClub(articles, limit);
  return runPublishingSweeps(ranked);
}
