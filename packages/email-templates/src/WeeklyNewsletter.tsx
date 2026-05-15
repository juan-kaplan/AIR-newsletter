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
        <Text style={kicker}>Boletín mensual</Text>
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
          title="Oportunidades y competencias"
        />
      ) : null}

      {newsArticles.length > 0 ? (
        <ArticleSection articles={newsArticles} title="Noticias de robótica" />
      ) : null}

      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

interface ArticleSectionProps {
  articles: NewsletterArticle[];
  title: string;
}

function ArticleSection({ articles, title }: ArticleSectionProps) {
  return (
    <Section style={articleGroup}>
      <Section className="mobile-padding" style={sectionHeader}>
        <Text style={sectionTitle}>{title}</Text>
      </Section>
      {articles.map((article) => (
        <ArticleCard article={article} key={article.url} />
      ))}
    </Section>
  );
}

function isOpportunity(article: NewsletterArticle): boolean {
  return article.category === "competition" || article.category === "event";
}

const introSection = {
  padding: "36px 40px 26px",
};

const kicker = {
  color: "#607083",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0",
  lineHeight: "18px",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#1f2933",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "39px",
  margin: "0 0 14px",
};

const intro = {
  color: "#4b5a69",
  fontSize: "16px",
  lineHeight: "25px",
  margin: "0",
};

const summarySection = {
  backgroundColor: "#f6f8fa",
  borderBottom: "1px solid #d7dde5",
  borderTop: "1px solid #d7dde5",
  padding: "22px 40px 20px",
};

const summaryTitle = {
  color: "#1f2933",
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const summaryItem = {
  color: "#3f4d5d",
  fontSize: "14px",
  lineHeight: "21px",
  margin: "0 0 8px",
};

const summaryBullet = {
  color: "#0f5f8f",
  fontWeight: "700",
};

const articleGroup = {
  margin: "0",
};

const sectionHeader = {
  borderBottom: "2px solid #1f2933",
  padding: "30px 40px 10px",
};

const sectionTitle = {
  color: "#1f2933",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "28px",
  margin: "0",
};
