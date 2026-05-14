import { collectArticles } from "../collect";
import type { NewsletterIssue } from "../types";

export async function buildIssue(): Promise<NewsletterIssue> {
  const articles = await collectArticles();
  const now = new Date();
  const monthName = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(now);
  return {
    slug: `robotics-newsletter-${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`,
    subject: `AIR Robotics Monthly - ${monthName}`,
    preheader: "A source-grounded robotics digest for the UdeSA robotics circle.",
    articles: articles.slice(0, 8)
  };
}
