import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Section style={section}>
      {article.imageUrl ? (
        <Img alt="" src={article.imageUrl} style={image} />
      ) : null}
      <Text style={meta}>
        {labelForCategory(article.category)}
        {article.source ? ` / ${article.source}` : ""}
        {article.publishedAt ? ` / ${formatDate(article.publishedAt)}` : ""}
      </Text>
      <Heading as="h2" style={heading}>
        <Link href={article.url} style={link}>
          {article.title}
        </Link>
      </Heading>
      <Text style={summary}>{article.summary}</Text>
      <Button href={article.url} style={readLink}>
        Abrir enlace
      </Button>
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
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d9e0ea",
  margin: "0",
  padding: "22px 0",
};

const image = {
  border: "1px solid #d9e0ea",
  display: "block",
  height: "auto",
  margin: "0 0 16px",
  maxWidth: "100%",
  width: "100%",
};

const meta = {
  color: "#0b5f94",
  fontSize: "13px",
  fontWeight: "600",
  lineHeight: "18px",
  letterSpacing: "0",
  margin: "0 0 8px",
};

const heading = {
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "24px",
  lineHeight: "30px",
  margin: "0 0 10px",
};

const link = {
  color: "#172033",
  textDecoration: "none",
};

const summary = {
  color: "#344154",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0 0 14px",
};

const readLink = {
  backgroundColor: "#0b5f94",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0",
  padding: "10px 14px",
  textDecoration: "none",
};
