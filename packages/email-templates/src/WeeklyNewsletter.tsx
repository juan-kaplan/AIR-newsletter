import { Heading, Section, Text } from "@react-email/components";
import React from "react";
import { ArticleCard } from "./components/ArticleCard";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";
import type {
  NewsletterArticle,
  NewsletterIssue,
} from "../../newsletter/src/types";

interface WeeklyNewsletterProps {
  issue: NewsletterIssue;
  unsubscribeUrl: string;
}

export function WeeklyNewsletter({
  issue,
  unsubscribeUrl,
}: WeeklyNewsletterProps) {
  const opportunityArticles = issue.articles.filter(isOpportunity);
  const newsArticles = issue.articles.filter(
    (article) => !isOpportunity(article),
  );

  return (
    <Layout preheader={issue.preheader}>
      <Section className="mobile-padding" style={introSection}>
        <Text style={kicker}>Mayo 2026</Text>
        <Heading as="h1" style={heading}>
          {issue.subject}
        </Heading>
        <Text style={intro}>{issue.preheader}</Text>
      </Section>

      <Section className="mobile-padding" style={summarySection}>
        <Text style={summaryTitle}>En esta edición</Text>
        {issue.articles.slice(0, 5).map((article) => (
          <Text key={article.url} style={summaryItem}>
            <span style={summaryBullet}>•</span> {article.title}
          </Text>
        ))}
      </Section>

      {opportunityArticles.length > 0 ? (
        <ArticleSection
          articles={opportunityArticles}
          imageMode="first"
          title="Oportunidades y competencias"
        />
      ) : null}

      {newsArticles.length > 0 ? (
        <ArticleSection
          articles={newsArticles}
          imageMode="none"
          title="Noticias de robótica"
        />
      ) : null}

      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

interface ArticleSectionProps {
  articles: NewsletterArticle[];
  imageMode: "first" | "none";
  title: string;
}

function ArticleSection({ articles, imageMode, title }: ArticleSectionProps) {
  return (
    <Section style={articleGroup}>
      <Section className="mobile-padding" style={sectionHeader}>
        <Text style={sectionTitle}>{title}</Text>
      </Section>
      {articles.map((article, index) => (
        <ArticleCard
          article={article}
          emphasis={index === 0 && imageMode === "first" ? "lead" : "normal"}
          key={article.url}
          showImage={index === 0 && imageMode === "first"}
        />
      ))}
    </Section>
  );
}

function isOpportunity(article: NewsletterArticle): boolean {
  return article.category === "competition" || article.category === "event";
}

const introSection = {
  backgroundColor: "#f8fbfd",
  padding: "34px 40px 28px",
};

const kicker = {
  color: "#577083",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  lineHeight: "16px",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#10202d",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "30px",
  fontWeight: "800",
  letterSpacing: "-0.01em",
  lineHeight: "36px",
  margin: "0 0 12px",
};

const intro = {
  color: "#465766",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const summarySection = {
  backgroundColor: "#edf5fa",
  borderBottom: "1px solid #c8dce8",
  borderTop: "1px solid #c8dce8",
  padding: "24px 40px 20px",
};

const summaryTitle = {
  color: "#102f49",
  fontSize: "15px",
  fontWeight: "800",
  lineHeight: "20px",
  margin: "0 0 14px",
};

const summaryItem = {
  color: "#334759",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 9px",
};

const summaryBullet = {
  color: "#287aa5",
  fontWeight: "700",
};

const articleGroup = {
  margin: "0",
};

const sectionHeader = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d9e3eb",
  padding: "32px 40px 12px",
};

const sectionTitle = {
  color: "#102f49",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "20px",
  fontWeight: "800",
  letterSpacing: "-0.01em",
  lineHeight: "26px",
  margin: "0",
};
