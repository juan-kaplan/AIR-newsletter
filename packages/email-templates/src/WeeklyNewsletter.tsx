import { Heading, Section, Text } from "@react-email/components";
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
      <Section style={digestHeader}>
        <Text style={digestLabel}>This month in robotics</Text>
        <Text style={digestCount}>{issue.articles.length} source-backed links</Text>
      </Section>
      {issue.articles.map((article, index) => (
        <ArticleCard article={article} index={index} key={article.url} />
      ))}
      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

const heading = {
  color: "#111827",
  fontSize: "26px",
  lineHeight: "32px",
  margin: "0 0 10px"
};

const intro = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px"
};

const digestHeader = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  margin: "0 0 18px",
  padding: "14px 16px"
};

const digestLabel = {
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "22px",
  margin: "0 0 2px"
};

const digestCount = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "18px",
  margin: 0
};
