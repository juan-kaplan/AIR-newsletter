import { collectArticles } from "../collect";
import { loadRecentWeeklyDigests } from "../collect/weeklyStore";
import type { NewsletterIssue } from "../types";

export async function buildIssue(): Promise<NewsletterIssue> {
  const now = new Date();
  const issueMonth = getIssueMonth(now);
  const [articles, weeklyDigests] = await Promise.all([collectArticles(issueMonth), loadRecentWeeklyDigests(issueMonth)]);
  const monthName = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(issueMonth);
  return {
    slug: `robotics-newsletter-${issueMonth.getUTCFullYear()}-${String(issueMonth.getUTCMonth() + 1).padStart(2, "0")}`,
    subject: `AIR Robotics Monthly - ${monthName}`,
    preheader: "A curated robotics digest for building competitions across Argentinian universities.",
    articles: articles.slice(0, 8),
    generatedFromWeeks: weeklyDigests.map((digest) => digest.week)
  };
}

function getIssueMonth(now: Date): Date {
  if (now.getUTCDate() <= 3) {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 15));
  }

  return now;
}
