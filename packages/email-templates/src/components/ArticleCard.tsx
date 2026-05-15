import { Img, Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Section style={card}>
      {article.imageUrl ? (
        <Link href={article.url} style={imageLink}>
          <Img
            alt=""
            className="fluid-img"
            src={article.imageUrl}
            style={cardImage}
          />
        </Link>
      ) : null}
      <Text style={headline}>
        <Link href={article.url} style={headlineLink}>
          {article.title}
        </Link>
      </Text>
      <Text style={summary}>{article.summary}</Text>
      <Link href={article.url} style={ctaLink}>
        Leer análisis técnico →
      </Link>
    </Section>
  );
}

const headlineStack =
  "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const bodyStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #041627",
  margin: "0",
  padding: "20px 20px 22px",
  position: "relative" as const,
};

const imageLink = {
  display: "block",
  margin: "0 0 16px",
};

const cardImage = {
  border: "1px solid #041627",
  display: "block",
  height: "180px",
  margin: "0",
  maxWidth: "100%",
  objectFit: "cover" as const,
  objectPosition: "center" as const,
  width: "100%",
};

const headline = {
  color: "#041627",
  fontFamily: headlineStack,
  fontSize: "22px",
  fontWeight: 600 as const,
  letterSpacing: "-0.02em",
  lineHeight: "26px",
  margin: "0 0 12px",
};

const headlineLink = {
  color: "#041627",
  textDecoration: "none",
};

const summary = {
  color: "#475569",
  fontFamily: bodyStack,
  fontSize: "15px",
  fontWeight: 400 as const,
  lineHeight: "24px",
  margin: "0 0 16px",
};

const ctaLink = {
  borderBottom: "2px solid #041627",
  color: "#041627",
  display: "inline-block",
  fontFamily: headlineStack,
  fontSize: "13px",
  fontWeight: 700 as const,
  letterSpacing: "0.04em",
  paddingBottom: "2px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};
