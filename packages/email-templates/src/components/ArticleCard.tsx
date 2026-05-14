import { Heading, Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Section style={section}>
      <Heading as="h2" style={heading}>
        <Link href={article.url} style={link}>
          {article.title}
        </Link>
      </Heading>
      <Text style={summary}>{article.summary}</Text>
    </Section>
  );
}

const section = {
  borderTop: "1px solid #e5e7eb",
  padding: "20px 0"
};

const heading = {
  fontSize: "18px",
  lineHeight: "24px",
  margin: "0 0 8px"
};

const link = {
  color: "#0f766e",
  textDecoration: "none"
};

const summary = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "22px",
  margin: 0
};
