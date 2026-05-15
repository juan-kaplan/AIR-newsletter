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

  it("rewrites common English source blurbs for AIR readers", () => {
    const [article] = runPublishingSweeps([
      {
        title: "Closing the gap between animal movement and robotic control",
        url: "https://example.com/control",
        source: "Tech Xplore",
        category: "research",
        summary:
          "Animals move with a level of precision and adaptability that robots struggle to match. Researchers are developing a new AI-driven approach.",
      },
    ]);

    expect(article?.summary).toContain("control robótico");
    expect(article?.summary).toContain("Para el club");
    expect(article?.summary).not.toContain("Animals move");
  });
});
