import { Heading, Text } from "@react-email/components";
import React from "react";
import { ArticleCard } from "./components/ArticleCard";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";
import type { NewsletterIssue } from "../../newsletter/src/types";

interface WeeklyNewsletterProps {
  issue: NewsletterIssue;
  unsubscribeUrl: string;
}

export function WeeklyNewsletter({ issue, unsubscribeUrl }: WeeklyNewsletterProps) {
  return (
    <Layout preheader={issue.preheader}>
      <Heading as="h1" style={heading}>
        {issue.subject}
      </Heading>
      <Text style={intro}>{issue.preheader}</Text>
      {issue.articles.map((article) => (
        <ArticleCard article={article} key={article.url} />
      ))}
      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

const heading = {
  color: "#111827",
  fontSize: "28px",
  lineHeight: "34px",
  margin: "0 0 12px"
};

const intro = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 12px"
};
