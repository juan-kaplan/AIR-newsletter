import { collectArticles } from "../collect";
import { loadRecentWeeklyDigests } from "../collect/weeklyStore";
import type { NewsletterIssue } from "../types";
import { polishIssueWithAi } from "./aiPolish";

export async function buildIssue(
  env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterIssue> {
  const now = new Date();
  const issueMonth = getIssueMonth(now);
  const [articles, weeklyDigests] = await Promise.all([
    collectArticles(issueMonth),
    loadRecentWeeklyDigests(issueMonth),
  ]);
  const monthName = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(issueMonth);
  return polishIssueWithAi({
    slug: `air-club-newsletter-${issueMonth.getUTCFullYear()}-${String(issueMonth.getUTCMonth() + 1).padStart(2, "0")}`,
    subject: `Boletín AIR Club · IA & Robótica · ${monthName}`,
    preheader:
      "Noticias, oportunidades y recursos de inteligencia artificial y robótica aplicada para AIR Club UdeSA.",
    articles: articles.slice(0, 10),
    generatedFromWeeks: weeklyDigests.map((digest) => digest.week),
  }, env);
}

function getIssueMonth(now: Date): Date {
  if (now.getUTCDate() <= 3) {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15));
  }

  return now;
}
