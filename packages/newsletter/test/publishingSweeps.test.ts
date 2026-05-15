import { describe, expect, it } from "vitest";
import { runPublishingSweeps } from "../src/curate/publishingSweeps";

describe("publishing sweeps", () => {
  it("removes internal curation language and scraping artifacts from reader-visible text", () => {
    const [article] = runPublishingSweeps([
      {
        title: "PAL ROBOTICS UNVEILS NEW ARM",
        url: "https://example.com/arm",
        source: "Example",
        category: "competition",
        summary:
          "Por qué importa: Skip to main content Register Now menu Esta señal puede servir como modelo para pensar una competencia",
      },
    ]);

    expect(article?.title).toBe("Pal Robotics Unveils New Arm");
    expect(article?.summary).not.toMatch(
      /Por qué importa|Skip to main content|Register Now menu|señal|puede servir/,
    );
    expect(article?.summary).toContain("noticia");
    expect(article?.summary).toMatch(/[.!?]$/);
  });
});
