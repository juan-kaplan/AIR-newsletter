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
  const counts = getCategoryCounts(issue);

  return (
    <Layout preheader={issue.preheader}>
      <Heading as="h1" style={heading}>
        {issue.subject}
      </Heading>
      <Text style={intro}>{issue.preheader}</Text>
      <Section style={digestHeader}>
        <Text style={digestLabel}>This Issue</Text>
        <Text style={digestCount}>
          {issue.articles.length} selected links
          {issue.generatedFromWeeks && issue.generatedFromWeeks.length > 0 ? ` from ${issue.generatedFromWeeks.join(", ")}` : ""}
        </Text>
        <Text style={digestStats}>
          {counts.opportunities} opportunities / {counts.news} robotics news / {counts.research} research signals
        </Text>
      </Section>
      {issue.articles.map((article, index) => (
        <ArticleCard article={article} index={index} key={article.url} />
      ))}
      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

function getCategoryCounts(issue: NewsletterIssue): { opportunities: number; news: number; research: number } {
  return issue.articles.reduce(
    (counts, article) => {
      if (article.category === "competition" || article.category === "event") {
        return { ...counts, opportunities: counts.opportunities + 1 };
      }

      if (article.category === "research") {
        return { ...counts, research: counts.research + 1 };
      }

      return { ...counts, news: counts.news + 1 };
    },
    { opportunities: 0, news: 0, research: 0 }
  );
}

const heading = {
  color: "#f8fafc",
  fontSize: "28px",
  lineHeight: "34px",
  margin: "0 0 10px"
};

const intro = {
  color: "#bfd7ff",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px"
};

const digestHeader = {
  backgroundColor: "#111c2f",
  border: "1px solid #1f9bd1",
  borderRadius: "10px",
  margin: "0 0 18px",
  padding: "16px 18px"
};

const digestLabel = {
  color: "#8ffcff",
  fontSize: "16px",
  fontWeight: "800",
  lineHeight: "22px",
  margin: "0 0 2px"
};

const digestCount = {
  color: "#f8fafc",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0 0 6px"
};

const digestStats = {
  color: "#a7f3d0",
  fontSize: "13px",
  lineHeight: "18px",
  margin: 0
};
