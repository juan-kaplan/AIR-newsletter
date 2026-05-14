import { Heading, Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const badge = getBadge(article);

  return (
    <Section style={section}>
      <Text style={accent}>{badge}</Text>
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
      {article.selectionReason ? <Text style={reason}>Why it matters: {article.selectionReason}</Text> : null}
      <Text style={action}>
        <Link href={article.url} style={actionLink}>
          Open signal
        </Link>
      </Text>
    </Section>
  );
}

function getBadge(article: NewsletterArticle): string {
  if (article.category === "competition" || article.category === "event") {
    return "Opportunity";
  }

  if (article.category === "research") {
    return "Research";
  }

  if (article.category === "tooling") {
    return "Tooling";
  }

  return "Robotics News";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

const section = {
  backgroundColor: "#101827",
  border: "1px solid #24466d",
  borderRadius: "10px",
  margin: "0 0 16px",
  padding: "18px 18px 16px"
};

const accent = {
  color: "#08111f",
  backgroundColor: "#a7f3d0",
  borderRadius: "999px",
  display: "inline-block",
  fontSize: "11px",
  fontWeight: "800",
  lineHeight: "14px",
  margin: "0 0 10px",
  padding: "5px 9px",
  textTransform: "uppercase" as const
};

const meta = {
  color: "#7dd3fc",
  fontSize: "12px",
  fontWeight: "700",
  lineHeight: "16px",
  margin: "0 0 8px",
  textTransform: "uppercase" as const
};

const heading = {
  fontSize: "20px",
  lineHeight: "26px",
  margin: "0 0 8px"
};

const link = {
  color: "#f8fafc",
  textDecoration: "none"
};

const summary = {
  color: "#cbd5e1",
  fontSize: "15px",
  lineHeight: "23px",
  margin: "0 0 12px"
};

const reason = {
  backgroundColor: "#0f2238",
  borderLeft: "3px solid #22d3ee",
  color: "#dbeafe",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0 0 14px",
  padding: "10px 12px"
};

const action = {
  margin: 0
};

const actionLink = {
  color: "#8ffcff",
  fontSize: "13px",
  fontWeight: "800",
  textDecoration: "none"
};
