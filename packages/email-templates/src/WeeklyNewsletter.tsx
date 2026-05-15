import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import { ArticleCard } from "./components/ArticleCard";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";
import type { NewsletterIssue } from "../../newsletter/src/types";

interface WeeklyNewsletterProps {
  issue: NewsletterIssue;
  unsubscribeUrl: string;
}

export function WeeklyNewsletter({
  issue,
  unsubscribeUrl,
}: WeeklyNewsletterProps) {
  const [featured, ...secondaryArticles] = issue.articles;

  return (
    <Layout preheader={issue.preheader}>
      <Section style={hero}>
        <Text style={heroMeta}>Boletín mensual de robótica</Text>
        <Heading as="h1" style={heading}>
          {issue.subject}
        </Heading>
        <Text style={intro}>{issue.preheader}</Text>
      </Section>

      {featured ? (
        <Section style={featuredCard}>
          {featured.imageUrl ? (
            <Img alt="" src={featured.imageUrl} style={featuredImage} />
          ) : null}
          <Text style={featuredLabel}>Noticia principal</Text>
          <Text style={featuredMeta}>{formatArticleMeta(featured)}</Text>
          <Heading as="h2" style={featuredHeading}>
            <Link href={featured.url} style={featuredLink}>
              {featured.title}
            </Link>
          </Heading>
          <Text style={featuredSummary}>{featured.summary}</Text>
          <Button href={featured.url} style={cta}>
            Leer noticia
          </Button>
        </Section>
      ) : null}

      <Section style={divider} />

      <Section style={digestHeader}>
        <Text style={digestLabel}>Noticias seleccionadas</Text>
      </Section>

      {secondaryArticles.map((article) => (
        <ArticleCard article={article} key={article.url} />
      ))}
      <Footer unsubscribeUrl={unsubscribeUrl} />
    </Layout>
  );
}

function formatArticleMeta(
  article: NewsletterIssue["articles"][number],
): string {
  const parts = [labelForCategory(article.category)];
  if (article.source) {
    parts.push(article.source);
  }
  if (article.publishedAt) {
    parts.push(formatDate(article.publishedAt));
  }

  return parts.join(" / ");
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

const hero = {
  margin: "0 0 28px",
};

const heroMeta = {
  color: "#5d697c",
  fontSize: "14px",
  fontWeight: "600",
  letterSpacing: "0",
  lineHeight: "20px",
  margin: "0 0 14px",
};

const heading = {
  color: "#172033",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "38px",
  fontWeight: "700",
  lineHeight: "44px",
  margin: "0 0 18px",
};

const intro = {
  color: "#4b5565",
  fontSize: "17px",
  lineHeight: "27px",
  margin: "0",
};

const featuredCard = {
  backgroundColor: "#ffffff",
  margin: "0 0 34px",
  padding: "0",
};

const featuredLabel = {
  color: "#0b5f94",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const featuredImage = {
  border: "1px solid #d9e0ea",
  display: "block",
  height: "auto",
  margin: "0 0 22px",
  maxWidth: "100%",
  width: "100%",
};

const featuredMeta = {
  color: "#64748b",
  fontSize: "13px",
  letterSpacing: "0",
  lineHeight: "19px",
  margin: "0 0 18px",
};

const featuredHeading = {
  color: "#172033",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "30px",
  lineHeight: "36px",
  margin: "0 0 14px",
};

const featuredLink = {
  color: "#172033",
  textDecoration: "none",
};

const featuredSummary = {
  color: "#344154",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 18px",
};

const cta = {
  backgroundColor: "#0b5f94",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0",
  padding: "11px 16px",
  textDecoration: "none",
};

const divider = {
  borderTop: "1px solid #d9e0ea",
  fontSize: "1px",
  lineHeight: "1px",
  margin: "0 0 32px",
};

const digestHeader = {
  borderBottom: "2px solid #172033",
  margin: "0 0 18px",
  padding: "0",
};

const digestLabel = {
  color: "#172033",
  display: "inline-block",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "26px",
  margin: "0 0 8px",
  verticalAlign: "middle",
};
