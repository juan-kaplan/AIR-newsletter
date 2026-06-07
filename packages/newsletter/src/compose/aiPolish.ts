import type { NewsletterIssue } from "../types";

type AiProvider = "none" | "gemini" | "nvidia";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface PolishedIssuePayload {
  subject?: unknown;
  preheader?: unknown;
  intro?: unknown;
}

const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_NVIDIA_MODEL = "meta/llama-3.1-70b-instruct";
const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
];

export async function polishIssueWithAi(
  issue: NewsletterIssue,
  env: NodeJS.ProcessEnv = process.env,
): Promise<NewsletterIssue> {
  const provider = parseProvider(env.NEWSLETTER_AI_PROVIDER);
  if (provider === "none" || issue.articles.length === 0) {
    return issue;
  }

  try {
    const prompt = buildIssuePolishPrompt(issue);
    const text =
      provider === "nvidia"
        ? await callNvidia(prompt, env)
        : await callGemini(prompt, env);

    if (!text) {
      return issue;
    }

    return applyPolishedIssue(issue, parseJsonBlock(text));
  } catch (error) {
    console.warn(
      `AI issue polish fallback: ${error instanceof Error ? error.message : "unknown error"}.`,
    );
    return issue;
  }
}

function parseProvider(value: string | undefined): AiProvider {
  if (value === "gemini" || value === "nvidia") {
    return value;
  }

  if (value && value !== "none") {
    console.warn(`AI issue polish skipped: unknown NEWSLETTER_AI_PROVIDER=${value}.`);
  }

  return "none";
}

async function callNvidia(
  prompt: string,
  env: NodeJS.ProcessEnv,
): Promise<string | null> {
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.warn("NVIDIA issue polish skipped: NVIDIA_API_KEY is not set.");
    return null;
  }

  const response = await fetch(NVIDIA_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({
      model: env.NVIDIA_MODEL ?? DEFAULT_NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Eres el editor final de un newsletter universitario. Devuelves solo JSON válido y no inventas datos.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 1600,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA HTTP ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  return payload.choices?.[0]?.message?.content ?? null;
}

async function callGemini(
  prompt: string,
  env: NodeJS.ProcessEnv,
): Promise<string | null> {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini issue polish skipped: GEMINI_API_KEY is not set.");
    return null;
  }

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(20_000),
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
      const payload = (await response.json()) as GeminiResponse;
      return payload.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    }

    if (response.status !== 400 && response.status !== 429 && response.status !== 404 && response.status !== 503) {
      throw new Error(`Gemini HTTP ${response.status}`);
    }
  }

  throw new Error("all Gemini models failed");
}

function buildIssuePolishPrompt(issue: NewsletterIssue): string {
  return `Eres el editor del Boletín AIR Club UdeSA, el newsletter del club de inteligencia artificial y robótica de la Universidad de San Andrés.

Objetivo: que el texto visible sea claro, concreto y útil para estudiantes que construyen proyectos de IA aplicada, robótica, ROS2, visión, SLAM, navegación, autonomía y competencias.

Reglas:
- Solo escribe "subject", "preheader" e "intro" en español neutro. No traduzcas ni reescribas los artículos.
- No inventes datos, fuentes, fechas ni deadlines que no estén en el input.
- No incluyas emails, tokens ni texto interno.
- No uses frases como "Por qué importa", "señal", "interesante" ni justificaciones internas.

Campo "intro": párrafo editorial de apertura, 2-3 oraciones en español neutro, que resuma los temas destacados de este número (competencias, investigación, herramientas). Debe sonar como escrito por un estudiante para otros estudiantes del club, sin tono de marketing.

Devuelve solamente JSON con esta forma exacta:
{"subject":"...","preheader":"...","intro":"..."}

Newsletter:
${JSON.stringify(
  {
    subject: issue.subject,
    preheader: issue.preheader,
    articles: issue.articles.map((article) => ({
      title: article.title,
      url: article.url,
      summary: article.summary,
      source: article.source,
      category: article.category,
      publishedAt: article.publishedAt,
    })),
  },
  null,
  2,
)}`;
}

function parseJsonBlock(text: string): PolishedIssuePayload {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(withoutFence) as PolishedIssuePayload;
}

function applyPolishedIssue(
  issue: NewsletterIssue,
  payload: PolishedIssuePayload,
): NewsletterIssue {
  return {
    ...issue,
    ...(typeof payload.subject === "string"
      ? { subject: cleanModelText(payload.subject, 120) }
      : {}),
    ...(typeof payload.preheader === "string"
      ? { preheader: cleanModelText(payload.preheader, 220) }
      : {}),
    ...(typeof payload.intro === "string"
      ? { intro: cleanModelText(payload.intro, 480) }
      : {}),
  };
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
