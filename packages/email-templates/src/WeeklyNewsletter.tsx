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
    <Layout issueDate="14 de mayo de 2026" preheader={issue.preheader}>
      <Section style={editorBlock}>
        <table
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={editorTable}
          width="100%"
        >
          <tbody>
            <tr>
              <td style={editorMarkCell} width={56}>
                <div style={editorMark}>AR</div>
              </td>
              <td style={editorTextCell}>
                <Text style={editorName}>Equipo AIR Robótica</Text>
                <Text style={editorRole}>
                  <em>Curaduría semanal</em>
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={standfirstBlock}>
        <Heading as="h1" style={standfirstHeading}>
          {issue.subject}
        </Heading>
        <Text style={standfirstText}>{issue.preheader}</Text>
      </Section>

      {opportunityArticles.length > 0 ? (
        <ArticleSection
          articles={opportunityArticles}
          eyebrow="Esta semana"
          leadImage
          subtitle="Concursos, eventos y convocatorias abiertas"
          title="Oportunidades"
        />
      ) : null}

      {newsArticles.length > 0 ? (
        <ArticleSection
          articles={newsArticles}
          eyebrow="Para leer"
          leadImage={false}
          subtitle="Lo que pasó en robótica y vale la pena seguir"
          title="Selección editorial"
        />
      ) : null}

      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

interface ArticleSectionProps {
  articles: NewsletterArticle[];
  eyebrow: string;
  leadImage: boolean;
  subtitle: string;
  title: string;
}

function ArticleSection({
  articles,
  eyebrow,
  leadImage,
  subtitle,
  title,
}: ArticleSectionProps) {
  return (
    <Section style={articleGroup}>
      <Section style={sectionHeader}>
        <Text style={sectionEyebrow}>{eyebrow}</Text>
        <Text style={sectionTitle}>{title}</Text>
        <Text style={sectionSubtitle}>{subtitle}</Text>
      </Section>
      {articles.map((article, index) => {
        const isFirst = index === 0;
        return (
          <ArticleCard
            article={article}
            emphasis={isFirst && leadImage ? "lead" : "normal"}
            key={article.url}
            showImage={Boolean(article.imageUrl)}
          />
        );
      })}
    </Section>
  );
}

function isOpportunity(article: NewsletterArticle): boolean {
  return article.category === "competition" || article.category === "event";
}

const serifStack =
  "Georgia, 'Times New Roman', Times, ui-serif, serif";
const sansStack =
  "'Helvetica Neue', Helvetica, system-ui, 'Segoe UI', Arial, sans-serif";

const editorBlock = {
  backgroundColor: "#ffffff",
  padding: "20px 24px 8px",
};

const editorTable = {
  width: "100%",
};

const editorMarkCell = {
  padding: "0 12px 0 0",
  verticalAlign: "middle" as const,
  width: "56px",
};

const editorMark = {
  alignItems: "center",
  backgroundColor: "#0d0d0d",
  borderRadius: "28px",
  color: "#ffffff",
  display: "block",
  fontFamily: sansStack,
  fontSize: "16px",
  fontWeight: 700 as const,
  height: "56px",
  letterSpacing: "0.02em",
  lineHeight: "56px",
  textAlign: "center" as const,
  width: "56px",
};

const editorTextCell = {
  verticalAlign: "middle" as const,
};

const editorName = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "17px",
  fontWeight: 700 as const,
  lineHeight: "22px",
  margin: "0",
};

const editorRole = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "16px",
  fontWeight: 400 as const,
  lineHeight: "22px",
  margin: "0",
};

const standfirstBlock = {
  backgroundColor: "#ffffff",
  padding: "12px 24px 36px",
};

const standfirstHeading = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "26px",
  fontWeight: 500 as const,
  letterSpacing: "-0.005em",
  lineHeight: "32px",
  margin: "0 0 14px",
};

const standfirstText = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "19px",
  fontWeight: 400 as const,
  lineHeight: "28px",
  margin: "0",
};

const articleGroup = {
  margin: "0",
};

const sectionHeader = {
  backgroundColor: "#ffffff",
  borderTop: "3px solid #0d0d0d",
  margin: "0 24px",
  padding: "16px 0 18px",
};

const sectionEyebrow = {
  color: "#e3120b",
  fontFamily: sansStack,
  fontSize: "11px",
  fontWeight: 700 as const,
  letterSpacing: "0.12em",
  lineHeight: "16px",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
};

const sectionTitle = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "26px",
  fontWeight: 500 as const,
  letterSpacing: "-0.005em",
  lineHeight: "30px",
  margin: "0 0 4px",
};

const sectionSubtitle = {
  color: "#525252",
  fontFamily: serifStack,
  fontSize: "16px",
  fontStyle: "italic" as const,
  fontWeight: 400 as const,
  lineHeight: "22px",
  margin: "0",
};
