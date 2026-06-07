import { Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const meta = [article.source, article.publishedAt ? formatDate(article.publishedAt) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Section style={card}>
      <Text style={headline}>
        <Link href={article.url} style={headlineLink}>
          {article.title}
        </Link>
      </Text>
      <Text style={summary}>{article.summary}</Text>
      {meta ? <Text style={metaText}>{meta}</Text> : null}
      <Link href={article.url} style={ctaLink}>
        Leer más →
      </Link>
    </Section>
  );
}

const syneStack = "'Syne', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const outfitStack = "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const monoStack = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const card = {
  backgroundColor: "#ffffff",
  borderLeft: "3px solid #a40c4c",
  margin: "0 0 16px",
  padding: "20px 24px 22px",
};

const headline = {
  color: "#1a0810",
  fontFamily: syneStack,
  fontSize: "19px",
  fontWeight: 700 as const,
  letterSpacing: "-0.01em",
  lineHeight: "26px",
  margin: "0 0 10px",
};

const headlineLink = {
  color: "#1a0810",
  textDecoration: "none",
};

const summary = {
  color: "#8f5261",
  fontFamily: outfitStack,
  fontSize: "15px",
  fontWeight: 400 as const,
  lineHeight: "24px",
  margin: "0 0 12px",
};

const metaText = {
  color: "#c08c94",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 500 as const,
  letterSpacing: "0.06em",
  lineHeight: "14px",
  margin: "0 0 14px",
  textTransform: "uppercase" as const,
};

const ctaLink = {
  color: "#a40c4c",
  fontFamily: syneStack,
  fontSize: "13px",
  fontWeight: 700 as const,
  letterSpacing: "0.02em",
  textDecoration: "none",
};
