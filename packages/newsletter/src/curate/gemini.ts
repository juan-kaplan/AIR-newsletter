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

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
];

export async function refineRankingWithGemini(
  articles: ScoredArticle[],
  limit: number,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ScoredArticle[]> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey || articles.length === 0) {
    console.warn(
      apiKey
        ? "Gemini curation skipped: no candidate articles."
        : "Gemini curation skipped: GEMINI_API_KEY is not set.",
    );
    return articles.slice(0, limit);
  }

  try {
    const payload = await callGeminiWithFallback(
      apiKey,
      buildPrompt(articles, limit),
    );
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
                score:
                  typeof item.score === "number" ? item.score : article.score,
                selectionReason: item.reason ?? article.selectionReason,
              },
            ]
          : [];
      })
      .slice(0, limit);

    if (selected.length === 0) {
      console.warn(
        "Gemini curation fallback: model returned no matching URLs.",
      );
      return articles.slice(0, limit);
    }

    console.warn(`Gemini curation selected ${selected.length} article(s).`);
    return selected;
  } catch (error) {
    console.warn(
      `Gemini curation fallback: ${error instanceof Error ? error.message : "unknown error"}.`,
    );
    return articles.slice(0, limit);
  }
}

async function callGeminiWithFallback(
  apiKey: string,
  prompt: string,
): Promise<GeminiResponse | null> {
  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      },
    );

    if (response.ok) {
      console.warn(`Gemini curation using ${model}.`);
      return (await response.json()) as GeminiResponse;
    }

    console.warn(`Gemini model ${model} failed with HTTP ${response.status}.`);
    if (response.status !== 429 && response.status !== 404) {
      return null;
    }
  }

  console.warn(
    "Gemini curation fallback: all configured Gemini models failed.",
  );
  return null;
}

function parseGeminiSelection(text: string): GeminiSelection {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(withoutFence) as GeminiSelection;
}

function buildPrompt(articles: ScoredArticle[], limit: number): string {
  return `Sos curador de un boletín mensual de robótica para AIR, un club universitario de la Universidad de San Andrés en Argentina que quiere organizar competencias para universidades argentinas.

Elegí hasta ${limit} items. Para curaduría semanal, apuntá a 4-6 items fuertes cuando existan. Para curaduría mensual, apuntá a 6-10 items fuertes cuando existan. Priorizá una mezcla balanceada:
- 1-3 oportunidades de robótica todavía vigentes: inscripciones, fechas límite, convocatorias, reglamentos y noticias de clasificación
- 2-4 noticias de robótica, investigación o herramientas útiles para un club de grado
- ideas que equipos universitarios puedan copiar, estudiar o convertir en competencias locales
- oportunidades para estudiantes en Latinoamérica o accesibles globalmente
- investigación práctica: autonomía, percepción, manipulación, drones, rovers, ROS, simulación

No incluyas oportunidades cuya fecha de registro, envío o postulación ya haya pasado. Evitá noticias genéricas de negocios, contenido patrocinado, rondas de inversión y notas médicas/de depósito salvo que tengan un ángulo claro para una actividad del club.

Devolvé solamente JSON con esta forma. La razón debe estar en español:
{"selected":[{"url":"https://...","score":95,"reason":"razón breve para miembros del club"}]}

Candidates:
${articles
  .map(
    (article, index) => `${index + 1}. ${article.title}
url: ${article.url}
source: ${article.source ?? "unknown"}
publishedAt: ${article.publishedAt ?? "unknown"}
initialScore: ${article.score}
summary: ${article.summary}`,
  )
  .join("\n\n")}`;
}
