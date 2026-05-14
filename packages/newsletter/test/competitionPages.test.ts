import { afterEach, describe, expect, it, vi } from "vitest";
import { collectCompetitionPages } from "../src/collect/competitionPages";

describe("competition page collection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("extracts competition deadline snippets from static pages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            `<html><head><title>Robot Challenge</title></head><body><h1>Robot Challenge 2026</h1><p>Registration deadline is June 1 for university teams building autonomous rovers.</p></body></html>`,
            { status: 200, headers: { "content-type": "text/html" } }
          )
      )
    );

    const articles = await collectCompetitionPages(
      [{ key: "challenge", name: "Challenge", type: "competition_page", url: "https://example.com/challenge" }],
      new Date("2026-05-14T12:00:00.000Z")
    );

    expect(articles).toEqual([
      expect.objectContaining({
        title: "Robot Challenge 2026",
        category: "competition",
        publishedAt: "2026-05-14T12:00:00.000Z",
        summary: expect.stringContaining("Registration deadline")
      })
    ]);
  });
});
