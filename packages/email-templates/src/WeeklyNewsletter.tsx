import { Img, Link, Section, Text } from "@react-email/components";
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
}

const BAD_IMAGE_PATTERNS = /logo|icon|favicon|avatar|sprite|badge|thumb|pixel|tracking|spacer|\.svg|\.gif/i;

function isHeroWorthy(url: string): boolean {
  return !BAD_IMAGE_PATTERNS.test(url);
}

const SECTIONS: Array<{ label: string; categories: string[] }> = [
  { label: "INVESTIGACIÓN", categories: ["research"] },
  { label: "HERRAMIENTAS & INDUSTRIA", categories: ["tooling", "industry"] },
  { label: "COMPETENCIAS", categories: ["competition"] },
  { label: "DEL CLUB", categories: ["event"] },
];

export function WeeklyNewsletter({ issue }: WeeklyNewsletterProps) {
  const issueMonth = issue.subject.split(" · ").at(-1) ?? "";
  const heroArticle = issue.articles.find((a) => a.imageUrl && isHeroWorthy(a.imageUrl));
  const bodyArticles = issue.articles.filter((a) => a.url !== heroArticle?.url);

  return (
    <Layout issueMonth={issueMonth} preheader={issue.preheader}>

      <Section style={pageBlock}>
        {issue.intro ? (
          <Section style={introBlock}>
            <Text style={introText}>{issue.intro}</Text>
          </Section>
        ) : null}
        {heroArticle ? <HeroCard article={heroArticle} /> : null}
        {SECTIONS.map((section) => {
          const articles = bodyArticles.filter(
            (a) => a.category && section.categories.includes(a.category),
          );
          if (articles.length === 0) return null;
          return (
            <Section key={section.label}>
              <Text style={sectionHeader}>{section.label}</Text>
              {articles.map((article) => (
                <ArticleCard key={article.url} article={article} />
              ))}
            </Section>
          );
        })}
        {/* Articles with no recognized category or missing category */}
        {(() => {
          const knownCategories = SECTIONS.flatMap((s) => s.categories);
          const uncategorized = bodyArticles.filter(
            (a) => !a.category || !knownCategories.includes(a.category),
          );
          return uncategorized.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ));
        })()}
        <Footer />
      </Section>
    </Layout>
  );
}

interface HeroCardProps {
  article: NewsletterArticle;
}

const CATEGORY_LABELS: Record<string, string> = {
  competition: "Competencia",
  research: "Investigación",
  industry: "Industria",
  tooling: "Herramientas",
  event: "Evento",
};

function HeroCard({ article }: HeroCardProps) {
  const label = article.category ? CATEGORY_LABELS[article.category] : null;

  return (
    <Section style={heroSection}>
      {article.imageUrl ? (
        <Link href={article.url} style={imageLink}>
          <Img
            alt=""
            className="fluid-img"
            src={article.imageUrl}
            style={heroImage}
          />
        </Link>
      ) : null}
      <Section style={heroBody}>
        {label ? <Text style={heroCategoryTag}>{label}</Text> : null}
        <Text style={heroHeadline}>
          <Link href={article.url} style={heroHeadlineLink}>
            {article.title}
          </Link>
        </Text>
        <Text style={heroSummary}>{article.summary}</Text>
        <Link href={article.url} style={ctaButton}>
          Leer más
        </Link>
      </Section>
    </Section>
  );
}

const syneStack = "'Syne', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const outfitStack = "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const monoStack = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";


const pageBlock = {
  padding: "40px 32px 0",
};

const introBlock = {
  backgroundColor: "rgba(221,170,188,0.18)",
  borderLeft: "3px solid #a40c4c",
  margin: "0 0 24px",
  padding: "16px 20px",
};

const introText = {
  color: "#1a0810",
  fontFamily: outfitStack,
  fontSize: "15px",
  fontWeight: 400 as const,
  lineHeight: "24px",
  margin: "0",
};

const sectionHeader = {
  borderBottom: "2px solid #a40c4c",
  color: "#a40c4c",
  fontFamily: monoStack,
  fontSize: "11px",
  fontWeight: 700 as const,
  letterSpacing: "0.18em",
  lineHeight: "14px",
  margin: "32px 0 16px",
  paddingBottom: "10px",
  textTransform: "uppercase" as const,
};

const heroSection = {
  backgroundColor: "#ffffff",
  borderLeft: "3px solid #a40c4c",
  margin: "0 0 8px",
  padding: "0",
};

const imageLink = {
  display: "block",
};

const heroImage = {
  display: "block",
  height: "260px",
  margin: "0",
  maxWidth: "100%",
  objectFit: "cover" as const,
  objectPosition: "center" as const,
  width: "100%",
};

const heroBody = {
  padding: "24px 24px 26px",
};

const heroCategoryTag = {
  color: "#a40c4c",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 700 as const,
  letterSpacing: "0.14em",
  lineHeight: "14px",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const heroHeadline = {
  color: "#1a0810",
  fontFamily: syneStack,
  fontSize: "30px",
  fontWeight: 800 as const,
  letterSpacing: "-0.025em",
  lineHeight: "36px",
  margin: "0 0 14px",
};

const heroHeadlineLink = {
  color: "#1a0810",
  textDecoration: "none",
};

const heroSummary = {
  color: "#8f5261",
  fontFamily: outfitStack,
  fontSize: "16px",
  fontWeight: 400 as const,
  lineHeight: "26px",
  margin: "0 0 20px",
};

const ctaButton = {
  backgroundColor: "#a40c4c",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: syneStack,
  fontSize: "13px",
  fontWeight: 700 as const,
  letterSpacing: "0.06em",
  padding: "12px 22px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};
