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
  unsubscribeUrl: string;
}

export function WeeklyNewsletter({
  issue,
  unsubscribeUrl,
}: WeeklyNewsletterProps) {
  const hero = issue.articles.find((article) => Boolean(article.imageUrl));
  const rest = issue.articles.filter((article) => article.url !== hero?.url);
  const restPairs = chunk(rest, 2);

  return (
    <Layout issueMonth="Mayo 2026" preheader={issue.preheader}>
      <Section style={pageBlock}>
        {hero ? <HeroCard article={hero} /> : null}

        {restPairs.map((pair, rowIndex) => (
          <Section key={rowIndex} style={gridRow}>
            <table
              cellPadding={0}
              cellSpacing={0}
              role="presentation"
              style={gridTable}
              width="100%"
            >
              <tbody>
                <tr>
                  {pair.map((article, colIndex) => (
                    <td
                      className="stack"
                      key={article.url}
                      style={colIndex === 0 ? gridCellLeft : gridCellRight}
                      width="50%"
                    >
                      <ArticleCard article={article} />
                    </td>
                  ))}
                  {pair.length === 1 ? (
                    <td className="stack" style={gridCellRight} width="50%" />
                  ) : null}
                </tr>
              </tbody>
            </table>
          </Section>
        ))}

        <Footer unsubscribeUrl={unsubscribeUrl} />
      </Section>
    </Layout>
  );
}

interface HeroCardProps {
  article: NewsletterArticle;
}

function HeroCard({ article }: HeroCardProps) {
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
        <Text style={heroHeadline}>
          <Link href={article.url} style={heroHeadlineLink}>
            {article.title}
          </Link>
        </Text>
        <Text style={heroSummary}>{article.summary}</Text>
        <Section style={ctaWrap}>
          <Link href={article.url} style={ctaButton}>
            Leer más
          </Link>
        </Section>
      </Section>
    </Section>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

const headlineStack =
  "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const bodyStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const pageBlock = {
  backgroundColor: "#f1f3f5",
  padding: "32px 16px 0",
};

const heroSection = {
  backgroundColor: "#ffffff",
  border: "1px solid #041627",
  margin: "0 0 32px",
  padding: "0",
};

const imageLink = {
  display: "block",
};

const heroImage = {
  display: "block",
  height: "280px",
  margin: "0",
  maxWidth: "100%",
  objectFit: "cover" as const,
  objectPosition: "center" as const,
  width: "100%",
};

const heroBody = {
  padding: "24px 24px 28px",
};

const heroHeadline = {
  color: "#041627",
  fontFamily: headlineStack,
  fontSize: "36px",
  fontWeight: 700 as const,
  letterSpacing: "-0.035em",
  lineHeight: "40px",
  margin: "0 0 16px",
};

const heroHeadlineLink = {
  color: "#041627",
  textDecoration: "none",
};

const heroSummary = {
  color: "#475569",
  fontFamily: bodyStack,
  fontSize: "17px",
  fontWeight: 400 as const,
  lineHeight: "27px",
  margin: "0 0 24px",
};

const ctaWrap = {
  margin: "0",
  padding: "0",
};

const ctaButton = {
  backgroundColor: "#041627",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: headlineStack,
  fontSize: "13px",
  fontWeight: 700 as const,
  letterSpacing: "0.04em",
  padding: "14px 22px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const gridRow = {
  margin: "0 0 32px",
  padding: "0",
};

const gridTable = {
  width: "100%",
};

const gridCellLeft = {
  paddingRight: "16px",
  verticalAlign: "top" as const,
  width: "50%",
};

const gridCellRight = {
  paddingLeft: "0",
  verticalAlign: "top" as const,
  width: "50%",
};
