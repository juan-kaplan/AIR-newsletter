import { describe, expect, it } from "vitest";
import { renderEmail } from "../src/render/renderEmail";
import type { NewsletterIssue } from "../src/types";

const issue: NewsletterIssue = {
  slug: "weekly",
  subject: "Boletín AIR Robótica - mayo de 2026",
  preheader: "Noticias, oportunidades y recursos técnicos para AIR.",
  articles: [
    {
      title: "Useful link",
      url: "https://example.com/useful",
      summary: "A useful thing to read.",
      source: "Robotics Feed",
      imageUrl: "https://example.com/useful.jpg",
      publishedAt: "2026-05-04T12:00:00.000Z",
    },
  ],
};

describe("renderEmail", () => {
  it("renders html and text with the unsubscribe URL", async () => {
    const rendered = await renderEmail(
      issue,
      "https://worker.test/unsubscribe?token=abc",
    );

    expect(rendered.html).toContain(
      "https://worker.test/unsubscribe?token=abc",
    );
    expect(rendered.text).toContain(
      "https://worker.test/unsubscribe?token=abc",
    );
    expect(rendered.html).toContain("Robotics Feed");
    expect(rendered.html).toContain("https://example.com/useful.jpg");
    expect(rendered.html).toContain("AIR ROBÓTICA");
    expect(rendered.html).toContain("Noticias seleccionadas");
  });
});
