import { Heading, Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <Section style={section}>
      <Text style={meta}>
        {String(index + 1).padStart(2, "0")}
        {` / ${labelForCategory(article.category)}`}
        {article.source ? ` / ${article.source}` : ""}
        {article.publishedAt ? ` / ${formatDate(article.publishedAt)}` : ""}
      </Text>
      <Heading as="h2" style={heading}>
        <Link href={article.url} style={link}>
          {article.title}
        </Link>
      </Heading>
      <Text style={summary}>{article.summary}</Text>
      {article.selectionReason ? (
        <Text style={reason}>Por qué importa: {article.selectionReason}</Text>
      ) : null}
      <Link href={article.url} style={readLink}>
        ABRIR ENLACE
      </Link>
    </Section>
  );
}

function labelForCategory(category?: string): string {
  if (category === "competition") {
    return "OPORTUNIDAD";
  }
  if (category === "event") {
    return "EVENTO";
  }
  if (category === "research") {
    return "INVESTIGACIÓN";
  }
  if (category === "tooling") {
    return "HERRAMIENTA";
  }

  return "NOTICIA";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

const section = {
  backgroundColor: "#1d2021",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  margin: "0 0 18px",
  padding: "24px",
};

const meta = {
  color: "#adc7ff",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "12px",
  fontWeight: "700",
  lineHeight: "16px",
  letterSpacing: "0",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const heading = {
  fontFamily: "Geist, Helvetica, Arial, sans-serif",
  fontSize: "24px",
  lineHeight: "30px",
  margin: "0 0 10px",
};

const link = {
  color: "#e1e3e4",
  textDecoration: "none",
};

const summary = {
  color: "#c1c6d7",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0 0 14px",
};

const reason = {
  backgroundColor: "#282a2b",
  borderLeft: "3px solid #adc7ff",
  color: "#e1e3e4",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 14px",
  padding: "10px 12px",
};

const readLink = {
  color: "#adc7ff",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "12px",
  fontWeight: "500",
  letterSpacing: "0",
  textDecoration: "none",
};
