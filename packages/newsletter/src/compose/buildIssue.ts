import { collectArticles } from "../collect";
import { loadRecentWeeklyDigests } from "../collect/weeklyStore";
import type { NewsletterIssue } from "../types";

export async function buildIssue(): Promise<NewsletterIssue> {
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
  return {
    slug: `robotics-newsletter-${issueMonth.getUTCFullYear()}-${String(issueMonth.getUTCMonth() + 1).padStart(2, "0")}`,
    subject: `Boletín AIR Robótica - ${monthName}`,
    preheader:
      "Noticias, oportunidades y señales técnicas para el club de robótica de la Universidad de San Andrés.",
    articles: articles.slice(0, 10),
    generatedFromWeeks: weeklyDigests.map((digest) => digest.week),
  };
}

function getIssueMonth(now: Date): Date {
  if (now.getUTCDate() <= 3) {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15));
  }

  return now;
}
