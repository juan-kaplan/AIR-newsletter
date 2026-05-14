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
      summary: "A useful thing to read."
    }
  ]
};

describe("renderEmail", () => {
  it("renders html and text with the unsubscribe URL", async () => {
    const rendered = await renderEmail(issue, "https://worker.test/unsubscribe?token=abc");

    expect(rendered.html).toContain("https://worker.test/unsubscribe?token=abc");
    expect(rendered.text).toContain("https://worker.test/unsubscribe?token=abc");
  });
});
