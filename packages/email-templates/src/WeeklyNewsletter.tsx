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
          {featured.selectionReason ? (
            <Text style={featuredReason}>
              Por qué importa: {featured.selectionReason}
            </Text>
          ) : null}
          <Button href={featured.url} style={cta}>
            Leer noticia
          </Button>
        </Section>
      ) : null}

      <Section style={divider} />

      <Section style={digestHeader}>
        <Text style={sectionMarker}> </Text>
        <Text style={digestLabel}>Noticias seleccionadas</Text>
        <Text style={digestCount}>
          Una curaduría breve para detectar competencias, oportunidades e ideas
          técnicas que el club pueda convertir en proyectos o actividades
          locales.
        </Text>
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
  color: "#c1c6d7",
  fontSize: "14px",
  fontWeight: "600",
  letterSpacing: "0",
  lineHeight: "20px",
  margin: "0 0 14px",
};

const heading = {
  color: "#e1e3e4",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "44px",
  fontWeight: "700",
  lineHeight: "50px",
  margin: "0 0 18px",
};

const intro = {
  color: "#c1c6d7",
  fontSize: "18px",
  lineHeight: "29px",
  margin: "0",
};

const featuredCard = {
  backgroundColor: "#1d2021",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  margin: "0 0 34px",
  padding: "28px",
};

const featuredLabel = {
  color: "#adc7ff",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const featuredImage = {
  border: "1px solid #2a2a2a",
  borderRadius: "6px",
  display: "block",
  height: "auto",
  margin: "0 0 22px",
  maxWidth: "100%",
  width: "100%",
};

const featuredMeta = {
  color: "#c1c6d7",
  fontSize: "13px",
  letterSpacing: "0",
  lineHeight: "19px",
  margin: "0 0 18px",
};

const featuredHeading = {
  color: "#e1e3e4",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "30px",
  lineHeight: "36px",
  margin: "0 0 14px",
};

const featuredLink = {
  color: "#e1e3e4",
  textDecoration: "none",
};

const featuredSummary = {
  color: "#c1c6d7",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 18px",
};

const featuredReason = {
  borderLeft: "4px solid #adc7ff",
  color: "#e1e3e4",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 22px",
  padding: "4px 0 4px 14px",
};

const cta = {
  backgroundColor: "#adc7ff",
  borderRadius: "4px",
  color: "#102033",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0",
  padding: "11px 16px",
  textDecoration: "none",
};

const divider = {
  borderTop: "1px solid #2a2a2a",
  fontSize: "1px",
  lineHeight: "1px",
  margin: "0 0 32px",
};

const digestHeader = {
  margin: "0 0 24px",
  padding: "0",
};

const sectionMarker = {
  backgroundColor: "#adc7ff",
  borderRadius: "4px",
  display: "inline-block",
  fontSize: "1px",
  height: "24px",
  lineHeight: "24px",
  margin: "0 12px 0 0",
  verticalAlign: "middle",
  width: "4px",
};

const digestLabel = {
  color: "#e1e3e4",
  display: "inline-block",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "30px",
  margin: "0",
  verticalAlign: "middle",
};

const digestCount = {
  color: "#c1c6d7",
  fontSize: "15px",
  lineHeight: "23px",
  margin: "10px 0 0 16px",
};
