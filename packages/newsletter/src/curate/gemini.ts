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

export async function refineRankingWithGemini(articles: ScoredArticle[], limit: number, env: NodeJS.ProcessEnv = process.env): Promise<ScoredArticle[]> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey || articles.length === 0) {
    return articles.slice(0, limit);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(articles, limit) }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        })
      }
    );

    if (!response.ok) {
      return articles.slice(0, limit);
    }

    const payload = (await response.json()) as GeminiResponse;
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = text ? (JSON.parse(text) as GeminiSelection) : {};
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

    return selected.length > 0 ? selected : articles.slice(0, limit);
  } catch {
    return articles.slice(0, limit);
  }
}

function buildPrompt(articles: ScoredArticle[], limit: number): string {
  return `You curate a monthly robotics newsletter for an undergraduate robotics club in Argentina that wants to organize competitions for Argentinian universities.

Choose up to ${limit} items. Prefer:
- robotics competitions, registrations, deadlines, calls, rulebooks, and qualification news
- ideas that undergrad teams can copy, learn from, or turn into local competitions
- Latin America or globally accessible student opportunities
- practical robotics research: autonomy, perception, manipulation, drones, rovers, ROS, simulation

Avoid generic business news, sponsored content, funding-only news, and medical/warehouse-only stories unless there is a clear club activity angle.

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
