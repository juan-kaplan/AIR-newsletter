import { describe, expect, it } from "vitest";
import { renderEmail } from "../src/render/renderEmail";
import type { NewsletterIssue } from "../src/types";

const issue: NewsletterIssue = {
  slug: "weekly",
  subject: "Weekly issue",
  preheader: "A compact update.",
  articles: [
    {
      title: "Useful link",
      url: "https://example.com/useful",
      summary: "A useful thing to read.",
      source: "Robotics Feed",
      publishedAt: "2026-05-04T12:00:00.000Z"
    }
  ]
};

describe("renderEmail", () => {
  it("renders html and text with the unsubscribe URL", async () => {
    const rendered = await renderEmail(issue, "https://worker.test/unsubscribe?token=abc");

    expect(rendered.html).toContain("https://worker.test/unsubscribe?token=abc");
    expect(rendered.text).toContain("https://worker.test/unsubscribe?token=abc");
    expect(rendered.html).toContain("Robotics Feed");
    expect(rendered.html).toContain("This month in robotics");
  });
});
