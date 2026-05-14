import type { NewsletterIssue } from "../../newsletter/src/types";

export const sampleIssue: NewsletterIssue = {
  slug: "robotics-newsletter-sample",
  subject: "AIR Robotics Monthly - Sample Issue",
  preheader: "A source-grounded robotics digest for the UdeSA robotics circle.",
  articles: [
    {
      title: "The newsletter pipeline is alive",
      url: "https://example.com/newsletter-pipeline",
      summary: "This first issue proves collection, rendering, dry runs, and delivery logging are wired together.",
      source: "Manual seed",
      publishedAt: "2026-05-01T00:00:00.000Z"
    },
    {
      title: "Manual content stays simple",
      url: "https://example.com/manual-content",
      summary: "Start with markdown notes, then add RSS collection later without changing the sender contract.",
      source: "Manual seed",
      publishedAt: "2026-05-02T00:00:00.000Z"
    }
  ]
};
