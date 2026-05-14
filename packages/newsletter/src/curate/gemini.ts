import type { ScoredArticle } from "./scoring";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface GeminiSelection {
  selected?: Array<{
    url?: string;
    score?: number;
    reason?: string;
  }>;
}

const GEMINI_MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-lite-latest"];

export async function refineRankingWithGemini(articles: ScoredArticle[], limit: number, env: NodeJS.ProcessEnv = process.env): Promise<ScoredArticle[]> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey || articles.length === 0) {
    console.warn(apiKey ? "Gemini curation skipped: no candidate articles." : "Gemini curation skipped: GEMINI_API_KEY is not set.");
    return articles.slice(0, limit);
  }

  try {
    const payload = await callGeminiWithFallback(apiKey, buildPrompt(articles, limit));
    if (!payload) {
      return articles.slice(0, limit);
    }

    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("Gemini curation fallback: empty model response.");
      return articles.slice(0, limit);
    }

    const parsed = parseGeminiSelection(text);
    const byUrl = new Map(articles.map((article) => [article.url, article]));
    const selected = (parsed.selected ?? [])
      .flatMap((item) => {
        const article = item.url ? byUrl.get(item.url) : undefined;
        return article
          ? [
              {
                ...article,
                score: typeof item.score === "number" ? item.score : article.score,
                selectionReason: item.reason ?? article.selectionReason
              }
            ]
          : [];
      })
      .slice(0, limit);

    if (selected.length === 0) {
      console.warn("Gemini curation fallback: model returned no matching URLs.");
      return articles.slice(0, limit);
    }

    console.warn(`Gemini curation selected ${selected.length} article(s).`);
    return selected;
  } catch (error) {
    console.warn(`Gemini curation fallback: ${error instanceof Error ? error.message : "unknown error"}.`);
    return articles.slice(0, limit);
  }
}

async function callGeminiWithFallback(apiKey: string, prompt: string): Promise<GeminiResponse | null> {
  for (const model of GEMINI_MODELS) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    });

    if (response.ok) {
      console.warn(`Gemini curation using ${model}.`);
      return (await response.json()) as GeminiResponse;
    }

    console.warn(`Gemini model ${model} failed with HTTP ${response.status}.`);
    if (response.status !== 429 && response.status !== 404) {
      return null;
    }
  }

  console.warn("Gemini curation fallback: all configured Gemini models failed.");
  return null;
}

function parseGeminiSelection(text: string): GeminiSelection {
  const trimmed = text.trim();
  const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(withoutFence) as GeminiSelection;
}

function buildPrompt(articles: ScoredArticle[], limit: number): string {
  return `You curate a monthly robotics newsletter for an undergraduate robotics club in Argentina that wants to organize competitions for Argentinian universities.

Choose up to ${limit} items. For weekly curation, aim for 4-6 strong items when available. For monthly curation, aim for 6-10 strong items when available. Prefer a balanced mix:
- 1-3 still-open robotics opportunities: registrations, deadlines, calls, rulebooks, and qualification news
- 2-4 robotics news/research/tooling items that are useful for an undergrad club
- ideas that undergrad teams can copy, learn from, or turn into local competitions
- Latin America or globally accessible student opportunities
- practical robotics research: autonomy, perception, manipulation, drones, rovers, ROS, simulation

Do not include opportunities whose registration, submission, or application deadline has already passed. Avoid generic business news, sponsored content, funding-only news, and medical/warehouse-only stories unless there is a clear club activity angle.

Return JSON only in this shape:
{"selected":[{"url":"https://...","score":95,"reason":"short reason for club members"}]}

Candidates:
${articles
  .map(
    (article, index) => `${index + 1}. ${article.title}
url: ${article.url}
source: ${article.source ?? "unknown"}
publishedAt: ${article.publishedAt ?? "unknown"}
initialScore: ${article.score}
summary: ${article.summary}`
  )
  .join("\n\n")}`;
}
