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
            { status: 200, headers: { "content-type": "text/html" } },
          ),
      ),
    );

    const articles = await collectCompetitionPages(
      [
        {
          key: "challenge",
          name: "Challenge",
          type: "competition_page",
          url: "https://example.com/challenge",
        },
      ],
      new Date("2026-05-14T12:00:00.000Z"),
    );

    expect(articles).toEqual([
      expect.objectContaining({
        title: "Robot Challenge 2026",
        category: "competition",
        publishedAt: "2026-05-14T12:00:00.000Z",
        summary: expect.stringContaining(
          "oportunidad vigente hasta el 1 de junio de 2026",
        ),
      }),
    ]);
  });

  it("turns nav-heavy competition pages into clean Spanish summaries", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            `<html><head><title>WCRC</title></head><body><nav>Journey Challenge Specs The Wall Prizes Process Sponsors FAQ Venue Ambassador EN Register Now menu Journey Challenge Specs The Wall Prizes Process Sponsors FAQ Venue Campus Ambassador EN Register Now</nav><h1>WCRC</h1><p>Registration Open WCRC Wall-Climbing Robot Challenge invites university teams to design robots that climb vertical walls.</p><p>Registration deadline is June 1, 2026.</p></body></html>`,
            { status: 200, headers: { "content-type": "text/html" } },
          ),
      ),
    );

    const articles = await collectCompetitionPages(
      [
        {
          key: "wcrc",
          name: "Wall-Climbing Robot Challenge 2026",
          type: "competition_page",
          url: "https://example.com/wcrc",
        },
      ],
      new Date("2026-05-14T12:00:00.000Z"),
    );

    expect(articles[0]).toEqual(
      expect.objectContaining({
        title: "Wall-Climbing Robot Challenge 2026",
        summary:
          "Wall-Climbing Robot Challenge 2026 tiene inscripción abierta hasta el 1 de junio de 2026. El eje está en robots trepadores de muros, con trabajo fuerte de diseño mecánico, control y percepción. Puede servirle a AIR como referencia para diseñar desafíos universitarios y preparar equipos.",
      }),
    );
    expect(articles[0]?.summary).not.toContain("Journey Challenge Specs");
    expect(articles[0]?.summary).not.toContain("Register Now menu");
  });

  it("extracts a page image from Open Graph metadata", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            `<html><head><meta property="og:image" content="/hero.jpg"></head><body><h1>Robot Challenge 2026</h1><p>Registration deadline is June 1 for university teams building autonomous rovers.</p></body></html>`,
            { status: 200, headers: { "content-type": "text/html" } },
          ),
      ),
    );

    const articles = await collectCompetitionPages(
      [
        {
          key: "challenge",
          name: "Challenge",
          type: "competition_page",
          url: "https://example.com/challenge",
        },
      ],
      new Date("2026-05-14T12:00:00.000Z"),
    );

    expect(articles[0]).toEqual(
      expect.objectContaining({
        imageUrl: "https://example.com/hero.jpg",
      }),
    );
  });

  it("rejects expired registration deadlines", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            `<html><body><h1>RobotX Challenge 2026</h1><p>Start Registration & Grant Application. Deadline Extended to May 1.</p></body></html>`,
            { status: 200, headers: { "content-type": "text/html" } },
          ),
      ),
    );

    const articles = await collectCompetitionPages(
      [
        {
          key: "robotx",
          name: "RobotX",
          type: "competition_page",
          url: "https://example.com/robotx",
        },
      ],
      new Date("2026-05-14T12:00:00.000Z"),
    );

    expect(articles).toEqual([]);
  });
});
