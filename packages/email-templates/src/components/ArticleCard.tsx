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
  emphasis?: "lead" | "normal";
  showImage?: boolean;
}

export function ArticleCard({
  article,
  emphasis = "normal",
  showImage = false,
}: ArticleCardProps) {
  const isLead = emphasis === "lead";

  return (
    <Section className="mobile-padding" style={isLead ? leadSection : section}>
      {showImage && article.imageUrl ? (
        <Img
          alt=""
          className="fluid-img"
          src={article.imageUrl}
          style={leadImage}
        />
      ) : null}
      <Text style={meta}>
        {labelForCategory(article.category)}
        {article.source ? ` · ${article.source}` : ""}
        {article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ""}
      </Text>
      <Heading as="h3" style={isLead ? leadHeading : heading}>
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
  borderBottom: "1px solid #d9e3eb",
  margin: "0",
  padding: "26px 40px",
};

const leadSection = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d9e3eb",
  margin: "0",
  padding: "28px 40px 30px",
};

const leadImage = {
  borderRadius: "10px",
  display: "block",
  height: "auto",
  margin: "0 0 22px",
  maxWidth: "100%",
  width: "100%",
};

const meta = {
  color: "#5f7384",
  fontSize: "11px",
  fontWeight: "800",
  lineHeight: "16px",
  letterSpacing: "0.05em",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const heading = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "20px",
  fontWeight: "800",
  letterSpacing: "-0.01em",
  lineHeight: "26px",
  margin: "0 0 10px",
};

const leadHeading = {
  ...heading,
  fontSize: "25px",
  lineHeight: "31px",
  margin: "0 0 12px",
};

const link = {
  color: "#112637",
  textDecoration: "none",
};

const summary = {
  color: "#34495a",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0 0 18px",
};

const readLink = {
  backgroundColor: "#123f5f",
  borderRadius: "7px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "800",
  letterSpacing: "0",
  padding: "12px 18px",
  textDecoration: "none",
};
