import type { NewsletterIssue } from "../../newsletter/src/types";

export const sampleIssue: NewsletterIssue = {
  slug: "weekly-automatic-newsletter",
  subject: "Weekly automatic newsletter",
  preheader: "A short deterministic issue from your repo-first newsletter.",
  articles: [
    {
      title: "The newsletter pipeline is alive",
      url: "https://example.com/newsletter-pipeline",
      summary: "This first issue proves collection, rendering, dry runs, and delivery logging are wired together."
    },
    {
      title: "Manual content stays simple",
      url: "https://example.com/manual-content",
      summary: "Start with markdown notes, then add RSS collection later without changing the sender contract."
    }
  ]
};
