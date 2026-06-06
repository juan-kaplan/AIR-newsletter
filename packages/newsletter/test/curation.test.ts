import { describe, expect, it } from "vitest";
import { curateMonthlyArticles, curateWeeklyArticles } from "../src/curate";
import { getCurrentWeeklyWindow, isPublishedWithin } from "../src/collect/weeklyStore";
import type { NewsletterArticle } from "../src/types";

describe("newsletter curation", () => {
  it("selects at most six weekly items and prioritizes competition deadlines", async () => {
    const articles: NewsletterArticle[] = [
      article("Warehouse automation funding round", "Generic business update about logistics robots.", "industry"),
      article("RoboCup registration deadline opens for university teams", "Student teams can qualify for a robotics competition in Buenos Aires.", "competition"),
      article("New rover challenge proposal deadline", "Undergraduate university teams can submit a proposal for an online competition.", "competition"),
      article("Robots learn navigation in crowded halls", "A lab prototype improves autonomous navigation.", "research"),
      article("Drone perception dataset released", "Open source tools for aerial robotics teams.", "research"),
      article("Manipulator gripper benchmark", "A practical robot manipulation benchmark.", "research")
    ];

    const selected = await curateWeeklyArticles(articles, 6, {});

    expect(selected.length).toBeLessThanOrEqual(6);
    expect(selected.slice(0, 2).map((item) => item.title)).toEqual(
      expect.arrayContaining(["RoboCup registration deadline opens for university teams", "New rover challenge proposal deadline"])
    );
    expect(selected.every((item) => item.selectionReason)).toBe(true);
  });

  it("selects at most ten monthly items", async () => {
    const selected = await curateMonthlyArticles(
      Array.from({ length: 12 }, (_, index) =>
        article(`University robotics competition item ${index}`, "Registration deadline for student teams in Argentina.", "competition")
      ),
      10,
      {}
    );

    expect(selected).toHaveLength(10);
  });

  it("keeps weekly collection inside the current ISO week", () => {
    const { week, windowStart, windowEnd } = getCurrentWeeklyWindow(new Date("2026-05-14T12:00:00.000Z"));

    expect(week).toBe("2026-W20");
    expect(isPublishedWithin(article("inside", "robotics", "research", "2026-05-13T12:00:00.000Z"), windowStart, windowEnd)).toBe(true);
    expect(isPublishedWithin(article("outside", "robotics", "research", "2026-05-04T12:00:00.000Z"), windowStart, windowEnd)).toBe(false);
  });

  it("keeps only competitions accessible remotely or from Argentina", async () => {
    const selected = await curateWeeklyArticles(
      [
        article("Remote robotics challenge opens", "University teams can register for an online autonomous robot competition.", "competition"),
        article("Buenos Aires AI robotics hackathon", "Student teams can register for a computer vision challenge in Buenos Aires.", "competition"),
        article("International rover championship deadline", "University teams can register for an in-person robotics competition in Canada.", "competition"),
      ],
      6,
      {}
    );

    expect(selected.map((item) => item.title)).toEqual(
      expect.arrayContaining([
        "Remote robotics challenge opens",
        "Buenos Aires AI robotics hackathon",
      ])
    );
    expect(selected.map((item) => item.title)).not.toContain(
      "International rover championship deadline"
    );
  });

  it("prioritizes AI research and tooling over generic industry updates", async () => {
    const selected = await curateWeeklyArticles(
      [
        article("Open weights LLM benchmark released", "Researchers released model weights, evaluation results, and fine-tuning notes for student teams.", "research"),
        article("Computer vision toolkit for robots", "Open source perception tooling helps teams train and evaluate a vision model.", "tooling"),
        article("AI startup raises new funding round", "A company announced earnings and a funding round for its model business.", "industry"),
      ],
      6,
      {}
    );

    expect(selected.map((item) => item.title)).toEqual([
      "Open weights LLM benchmark released",
      "Computer vision toolkit for robots",
    ]);
  });
});

function article(title: string, summary: string, category: NewsletterArticle["category"], publishedAt = "2026-05-13T12:00:00.000Z"): NewsletterArticle {
  return {
    title,
    summary,
    category,
    publishedAt,
    source: "Test Source",
    url: `https://example.com/${encodeURIComponent(title)}`
  };
}
