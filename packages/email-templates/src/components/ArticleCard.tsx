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
    <Section className="mobile-padding" style={section}>
      {article.imageUrl ? (
        <Img
          alt=""
          className="fluid-img"
          src={article.imageUrl}
          style={image}
        />
      ) : null}
      <Text style={meta}>
        {labelForCategory(article.category)}
        {article.source ? ` · ${article.source}` : ""}
        {article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ""}
      </Text>
      <Heading as="h3" style={heading}>
        <Link href={article.url} style={link}>
          {article.title}
        </Link>
      </Heading>
      <Text style={summary}>{article.summary}</Text>
      <Button href={article.url} style={readLink}>
        Leer más
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
  borderBottom: "1px solid #d7dde5",
  margin: "0",
  padding: "28px 40px",
};

const image = {
  display: "block",
  height: "auto",
  margin: "0 0 18px",
  maxWidth: "100%",
  width: "100%",
};

const meta = {
  color: "#607083",
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: "19px",
  letterSpacing: "0",
  margin: "0 0 9px",
  textTransform: "uppercase" as const,
};

const heading = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "23px",
  fontWeight: "700",
  lineHeight: "29px",
  margin: "0 0 11px",
};

const link = {
  color: "#1f2933",
  textDecoration: "none",
};

const summary = {
  color: "#3f4d5d",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0 0 16px",
};

const readLink = {
  backgroundColor: "#12344d",
  borderRadius: "0",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0",
  padding: "11px 16px",
  textDecoration: "none",
};
