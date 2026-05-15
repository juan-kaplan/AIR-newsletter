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
    title?: string;
    summary?: string;
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
                ...(item.title
                  ? { title: cleanModelText(item.title, 110) }
                  : {}),
                ...(item.summary
                  ? { summary: cleanModelText(item.summary, 360) }
                  : {}),
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

Además de seleccionar, reescribí title y summary como texto visible de newsletter:
- Español rioplatense claro, informativo y concreto.
- Escribí para estudiantes de AIR: qué pasó, qué pueden aprender o qué decisión concreta habilita.
- No uses "Por qué importa", "señal", "puede servirle a AIR", "interesante", "relevante", ni frases genéricas.
- No menciones que estás justificando la selección.
- Si es oportunidad, incluí deadline o estado de inscripción si aparece en el candidato.
- Si es investigación/herramienta, explicá la técnica o idea usable en el club.
- No inventes datos que no estén en el candidato.

Antes de responder, hacé tres barridas editoriales:
1. Eliminar texto de navegación, HTML, entidades, frases cortadas y títulos todo-en-mayúsculas.
2. Convertir resúmenes genéricos en descripción periodística para lectores del club.
3. Verificar que nada visible suene como nota interna de curaduría o justificación.

Devolvé solamente JSON con esta forma. La reason es interna y también en español:
{"selected":[{"url":"https://...","score":95,"title":"título publicable","summary":"resumen publicable de 1-2 oraciones","reason":"razón interna breve"}]}

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

function cleanModelText(value: string, maxLength: number): string {
  const cleaned = value
    .replace(/\bpor qué importa:?\s*/gi, "")
    .replace(/\bseñales?\b/gi, "noticias")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim();
}
