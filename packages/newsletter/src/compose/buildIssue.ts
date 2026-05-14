import { collectArticles } from "../collect";
import type { NewsletterIssue } from "../types";

export async function buildIssue(): Promise<NewsletterIssue> {
  const articles = await collectArticles();
  return {
    slug: "weekly-automatic-newsletter",
    subject: "Weekly automatic newsletter",
    preheader: "A short deterministic issue from your repo-first newsletter.",
    articles
  };
}
