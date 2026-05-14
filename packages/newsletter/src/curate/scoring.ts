import type { NewsletterArticle } from "../types";

export interface ScoredArticle extends NewsletterArticle {
  score: number;
  selectionReason: string;
}

const CLUB_CONTEXT =
  "club universitario de robótica que organiza competencias para universidades argentinas";

export function rankForRoboticsClub(
  articles: NewsletterArticle[],
  limit: number,
): ScoredArticle[] {
  return articles
    .map(scoreArticle)
    .filter((article) => article.score >= 12)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      const firstTime = first.publishedAt
        ? new Date(first.publishedAt).getTime()
        : 0;
      const secondTime = second.publishedAt
        ? new Date(second.publishedAt).getTime()
        : 0;
      return secondTime - firstTime;
    })
    .slice(0, limit);
}

export function scoreArticle(article: NewsletterArticle): ScoredArticle {
  const text =
    `${article.title} ${article.summary} ${article.source ?? ""}`.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  score += addScore(
    text,
    [
      "competition",
      "robotics challenge",
      "robot challenge",
      "tournament",
      "championship",
      "robocup",
      "vex",
      "robotx",
      "rover challenge",
    ],
    24,
    "noticia de competencia",
    reasons,
  );
  score += addScore(
    text,
    [
      "deadline",
      "registration",
      "application",
      "applications close",
      "proposal",
      "call for",
      "opens",
      "qualification",
    ],
    20,
    "fecha o inscripción accionable",
    reasons,
  );
  score += addScore(
    text,
    [
      "university",
      "universities",
      "college",
      "student",
      "undergraduate",
      "team",
    ],
    18,
    "encaja con equipos estudiantiles",
    reasons,
  );
  score += addScore(
    text,
    [
      "argentina",
      "argentinian",
      "latin america",
      "latam",
      "south america",
      "brazil",
      "chile",
      "uruguay",
    ],
    18,
    "relevancia regional",
    reasons,
  );
  score += addScore(
    text,
    [
      "open source",
      "ros",
      "simulation",
      "navigation",
      "perception",
      "manipulation",
      "autonomous",
      "drone",
      "rover",
    ],
    12,
    "idea técnica construible",
    reasons,
  );
  score += addScore(
    text,
    ["research", "paper", "lab", "prototype", "dataset"],
    8,
    "valor técnico para aprender",
    reasons,
  );

  if (article.category === "competition" || article.category === "event") {
    score += 16;
    reasons.push(
      article.category === "competition"
        ? "fuente de competencia"
        : "fuente de evento",
    );
  }

  if (article.publishedAt) {
    score += recencyBoost(article.publishedAt);
  }

  score -= addPenalty(
    text,
    ["sponsored", "webinar", "funding round", "raises", "stock", "earnings"],
    10,
  );
  score -= addPenalty(
    text,
    ["surgical", "hospital", "warehouse", "logistics"],
    4,
  );
  score -= addPenalty(
    text,
    [
      "order worth",
      "deployment order",
      "million agreement",
      "hospitality food",
    ],
    12,
  );

  return {
    ...article,
    score,
    selectionReason:
      reasons.slice(0, 3).join(", ") || `Relevante para ${CLUB_CONTEXT}`,
  };
}

function addScore(
  text: string,
  keywords: string[],
  points: number,
  reason: string,
  reasons: string[],
): number {
  if (!keywords.some((keyword) => hasKeyword(text, keyword))) {
    return 0;
  }

  reasons.push(reason);
  return points;
}

function addPenalty(text: string, keywords: string[], points: number): number {
  return keywords.some((keyword) => hasKeyword(text, keyword)) ? points : 0;
}

function hasKeyword(text: string, keyword: string): boolean {
  return new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(keyword)}([^a-z0-9]|$)`,
    "i",
  ).test(text);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function recencyBoost(value: string): number {
  const published = new Date(value).getTime();
  if (Number.isNaN(published)) {
    return 0;
  }

  const ageDays = Math.max(0, (Date.now() - published) / 86_400_000);
  return Math.max(0, 10 - Math.floor(ageDays));
}
