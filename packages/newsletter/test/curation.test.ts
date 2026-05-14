import { describe, expect, it } from "vitest";
import { curateMonthlyArticles, curateWeeklyArticles } from "../src/curate";
import { getCurrentWeeklyWindow, isPublishedWithin } from "../src/collect/weeklyStore";
import type { NewsletterArticle } from "../src/types";

describe("newsletter curation", () => {
  it("selects at most six weekly items and prioritizes competition deadlines", async () => {
    const articles: NewsletterArticle[] = [
      article("Warehouse automation funding round", "Generic business update about logistics robots.", "industry"),
      article("RoboCup registration deadline opens for university teams", "Student teams can qualify for a robotics competition.", "competition"),
      article("New rover challenge proposal deadline", "Undergraduate university teams can submit a proposal.", "competition"),
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
        article(`University robotics competition item ${index}`, "Registration deadline for student teams.", "competition")
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
