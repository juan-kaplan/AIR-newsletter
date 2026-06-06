import { afterEach, describe, expect, it, vi } from "vitest";
import { polishIssueWithAi } from "../src/compose/aiPolish";
import type { NewsletterIssue } from "../src/types";

const issue: NewsletterIssue = {
  slug: "air-club-2026-06",
  subject: "Boletín AIR Club · IA & Robótica · junio de 2026",
  preheader:
    "Noticias, oportunidades y recursos de inteligencia artificial y robótica aplicada para AIR Club UdeSA.",
  articles: [
    {
      title: "Open weights LLM benchmark released",
      url: "https://example.com/llm",
      summary:
        "Researchers released model weights, evaluation results, and fine-tuning notes for student teams.",
      source: "Research Feed",
      category: "research",
      publishedAt: "2026-06-01T12:00:00.000Z",
    },
  ],
};

describe("AI issue polish", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses NVIDIA to polish reader-visible issue text while preserving article identity", async () => {
    const fetchMock = vi.fn(
      async (_url: string | URL, _request?: RequestInit) =>
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    subject: "Boletín AIR Club · modelos abiertos · junio de 2026",
                    preheader:
                      "Modelos abiertos, evaluación y robótica aplicada para AIR Club UdeSA.",
                    articles: [
                      {
                        url: "https://example.com/llm",
                        title: "Un benchmark de LLMs abiertos para experimentar en el club",
                        summary:
                          "El trabajo publica pesos, métricas y notas de fine-tuning que sirven para comparar modelos en proyectos de estudiantes.",
                      },
                    ],
                  }),
                },
              },
            ],
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const polished = await polishIssueWithAi(issue, {
      NEWSLETTER_AI_PROVIDER: "nvidia",
      NVIDIA_API_KEY: "test-key",
    });

    expect(polished.subject).toBe(
      "Boletín AIR Club · modelos abiertos · junio de 2026",
    );
    expect(polished.preheader).toBe(
      "Modelos abiertos, evaluación y robótica aplicada para AIR Club UdeSA.",
    );
    expect(polished.articles[0]).toMatchObject({
      url: "https://example.com/llm",
      source: "Research Feed",
      category: "research",
      title: "Un benchmark de LLMs abiertos para experimentar en el club",
    });

    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.headers as Record<string, string>).toMatchObject({
      authorization: "Bearer test-key",
    });
    expect(JSON.stringify(request?.body)).not.toContain("@udesa.edu.ar");
  });

  it("falls back to the original issue when NVIDIA returns invalid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              choices: [{ message: { content: "not-json" } }],
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          ),
      ),
    );

    await expect(
      polishIssueWithAi(issue, {
        NEWSLETTER_AI_PROVIDER: "nvidia",
        NVIDIA_API_KEY: "test-key",
      }),
    ).resolves.toEqual(issue);
  });

  it("skips NVIDIA when no API key is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      polishIssueWithAi(issue, { NEWSLETTER_AI_PROVIDER: "nvidia" }),
    ).resolves.toEqual(issue);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
