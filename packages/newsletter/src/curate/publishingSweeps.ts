import type { NewsletterArticle } from "../types";

export function runPublishingSweeps(
  articles: NewsletterArticle[],
): NewsletterArticle[] {
  return articles.map((article) =>
    sweepAudienceFit(sweepReaderVisibleText(sweepScrapingArtifacts(article))),
  );
}

function sweepScrapingArtifacts(article: NewsletterArticle): NewsletterArticle {
  return {
    ...article,
    title: cleanTitle(article.title),
    summary: cleanSummary(article.summary),
  };
}

function sweepReaderVisibleText(article: NewsletterArticle): NewsletterArticle {
  return {
    ...article,
    summary: article.summary
      .replace(/\bpor qué importa:?\s*/gi, "")
      .replace(/\bpuede servirle a AIR\s*/gi, "AIR puede usarlo ")
      .replace(/señales/gi, "noticias")
      .replace(/señal/gi, "noticia")
      .replace(/\brazón interna\b/gi, "")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

function sweepAudienceFit(article: NewsletterArticle): NewsletterArticle {
  if (article.category !== "competition") {
    return {
      ...article,
      summary: ensureCompleteSentence(article.summary),
    };
  }

  const summary = article.summary;
  if (/AIR|club|universitari/i.test(summary)) {
    return {
      ...article,
      summary: ensureCompleteSentence(summary),
    };
  }

  return {
    ...article,
    summary: ensureCompleteSentence(
      `${summary} Para el club, es una referencia concreta para comparar reglas, pruebas y niveles de dificultad.`,
    ),
  };
}

function cleanTitle(value: string): string {
  const cleaned = decodeEntities(value).replace(/\s+/g, " ").trim();
  if (cleaned === cleaned.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(cleaned)) {
    return titleCase(cleaned);
  }

  return cleaned;
}

function cleanSummary(value: string): string {
  return truncateAtSentence(
    decodeEntities(value)
      .replace(
        /\b(skip to main content|register now|sign in|menu|faq|sponsors?|privacy policy|terms of service)\b/gi,
        " ",
      )
      .replace(/\s+/g, " ")
      .trim(),
    420,
  );
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function truncateAtSentence(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return ensureCompleteSentence(value);
  }

  const sentenceEnd = Math.max(
    value.lastIndexOf(". ", maxLength),
    value.lastIndexOf("? ", maxLength),
    value.lastIndexOf("! ", maxLength),
  );
  if (sentenceEnd >= 120) {
    return value.slice(0, sentenceEnd + 1).trim();
  }

  return `${value
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim()}...`;
}

function ensureCompleteSentence(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function titleCase(value: string): string {
  const smallWords = new Set([
    "and",
    "or",
    "the",
    "of",
    "for",
    "to",
    "in",
    "with",
    "a",
    "an",
  ]);
  return value
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index > 0 && smallWords.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}
