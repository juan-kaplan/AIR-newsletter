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
      category: "competition",
      source: "Robotics Feed",
      imageUrl: "https://example.com/useful.jpg",
      publishedAt: "2026-05-04T12:00:00.000Z",
      selectionReason: "internal scoring note",
    },
    {
      title: "Tooling note",
      url: "https://example.com/tooling",
      summary: "A useful technical note.",
      category: "tooling",
      source: "Robotics Feed",
      publishedAt: "2026-05-05T12:00:00.000Z",
      selectionReason: "internal scoring note",
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
    expect(rendered.html).toContain("AIR Robótica");
    expect(rendered.html).toContain("Selección editorial");
    expect(rendered.html).toContain("email-container");
    expect(rendered.html).not.toContain("Una curaduría breve");
    expect(rendered.html).not.toContain("Por qué importa");
    expect(rendered.html).not.toContain("internal scoring note");
  });
});
