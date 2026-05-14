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
        {article.source ? ` / ${article.source}` : ""}
        {article.publishedAt ? ` / ${formatDate(article.publishedAt)}` : ""}
      </Text>
      <Heading as="h2" style={heading}>
        <Link href={article.url} style={link}>
          {article.title}
        </Link>
      </Heading>
      <Text style={summary}>{article.summary}</Text>
    </Section>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

const section = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  margin: "0 0 14px",
  padding: "18px 18px 16px"
};

const meta = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "700",
  lineHeight: "16px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const
};

const heading = {
  fontSize: "19px",
  lineHeight: "25px",
  margin: "0 0 8px"
};

const link = {
  color: "#0f172a",
  textDecoration: "none"
};

const summary = {
  color: "#334155",
  fontSize: "15px",
  lineHeight: "23px",
  margin: 0
};
