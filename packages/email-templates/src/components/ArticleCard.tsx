import { Img, Link, Section, Text } from "@react-email/components";
import React from "react";
import type { NewsletterArticle } from "../../../newsletter/src/types";

interface ArticleCardProps {
  article: NewsletterArticle;
  emphasis?: "lead" | "normal";
  showImage?: boolean;
}

export function ArticleCard({
  article,
  emphasis = "normal",
  showImage = false,
}: ArticleCardProps) {
  const isLead = emphasis === "lead";
  const hasImage = showImage && Boolean(article.imageUrl);
  const kicker = labelForCategory(article.category);

  if (isLead && hasImage) {
    return (
      <Section style={leadWrapper}>
        <Link href={article.url} style={imageLink}>
          <Img
            alt=""
            className="fluid-img"
            src={article.imageUrl}
            style={leadImage}
          />
        </Link>
        <Section style={leadBody}>
          <Text style={kickerStyle}>{kicker}</Text>
          <Text style={leadHeadline}>
            <Link href={article.url} style={headlineLink}>
              {article.title}
            </Link>
          </Text>
          <Text style={leadSummary}>{article.summary}</Text>
          <Text style={leadMeta}>{metaLine(article)}</Text>
        </Section>
        <Divider />
      </Section>
    );
  }

  if (hasImage) {
    return (
      <Section style={rowWrapper}>
        <table
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={rowTable}
          width="100%"
        >
          <tbody>
            <tr>
              <td className="stack" style={rowImageCell} width="45%">
                <Link href={article.url} style={imageLink}>
                  <Img
                    alt=""
                    className="fluid-img"
                    src={article.imageUrl}
                    style={rowImage}
                  />
                </Link>
              </td>
              <td className="stack" style={rowTextCell} width="55%">
                <Text style={kickerStyle}>{kicker}</Text>
                <Text style={rowHeadline}>
                  <Link href={article.url} style={headlineLink}>
                    {article.title}
                  </Link>
                </Text>
                <Text style={rowSummary}>{article.summary}</Text>
                <Text style={rowMeta}>{metaLine(article)}</Text>
              </td>
            </tr>
          </tbody>
        </table>
        <Divider />
      </Section>
    );
  }

  return (
    <Section style={textWrapper}>
      <Text style={kickerStyle}>{kicker}</Text>
      <Text style={textHeadline}>
        <Link href={article.url} style={headlineLink}>
          {article.title}
        </Link>
      </Text>
      <Text style={textSummary}>{article.summary}</Text>
      <Text style={textMeta}>{metaLine(article)}</Text>
      <Divider />
    </Section>
  );
}

function Divider() {
  return <Section style={divider} />;
}

function metaLine(article: NewsletterArticle): string {
  const parts: string[] = [];
  if (article.source) {
    parts.push(article.source);
  }
  if (article.publishedAt) {
    parts.push(formatDate(article.publishedAt));
  }
  return parts.join(" · ");
}

function labelForCategory(category?: string): string {
  if (category === "competition") {
    return "Oportunidad";
  }
  if (category === "event") {
    return "Evento";
  }
  if (category === "research") {
    return "Investigación";
  }
  if (category === "tooling") {
    return "Herramienta";
  }

  return "Noticia";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
  }).format(date);
}

const serifStack =
  "Georgia, 'Times New Roman', Times, ui-serif, serif";
const sansStack =
  "'Helvetica Neue', Helvetica, system-ui, 'Segoe UI', Arial, sans-serif";

const accentRed = "#e3120b";

const leadWrapper = {
  backgroundColor: "#ffffff",
  margin: "0",
  padding: "0",
};

const imageLink = {
  textDecoration: "none",
};

const leadImage = {
  display: "block",
  height: "280px",
  margin: "0",
  maxWidth: "100%",
  objectFit: "cover" as const,
  objectPosition: "center" as const,
  width: "100%",
};

const leadBody = {
  padding: "20px 24px 6px",
};

const kickerStyle = {
  color: accentRed,
  fontFamily: sansStack,
  fontSize: "13px",
  fontWeight: 500 as const,
  letterSpacing: "0.04em",
  lineHeight: "18px",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
};

const headlineLink = {
  color: "#0d0d0d",
  textDecoration: "none",
};

const leadHeadline = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "28px",
  fontWeight: 600 as const,
  letterSpacing: "-0.01em",
  lineHeight: "34px",
  margin: "0 0 12px",
};

const leadSummary = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "17px",
  fontWeight: 400 as const,
  lineHeight: "26px",
  margin: "0 0 10px",
};

const leadMeta = {
  color: "#525252",
  fontFamily: sansStack,
  fontSize: "12px",
  fontWeight: 400 as const,
  letterSpacing: "0.02em",
  lineHeight: "16px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const rowWrapper = {
  backgroundColor: "#ffffff",
  margin: "0",
  padding: "0",
};

const rowTable = {
  width: "100%",
};

const rowImageCell = {
  padding: "0 8px 8px 24px",
  verticalAlign: "top" as const,
};

const rowImage = {
  display: "block",
  height: "auto",
  margin: "0",
  maxWidth: "100%",
  width: "100%",
};

const rowTextCell = {
  padding: "0 24px 8px 8px",
  verticalAlign: "top" as const,
};

const rowHeadline = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "20px",
  fontWeight: 500 as const,
  lineHeight: "26px",
  margin: "0 0 8px",
};

const rowSummary = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "16px",
  fontWeight: 400 as const,
  lineHeight: "24px",
  margin: "0 0 8px",
};

const rowMeta = {
  color: "#525252",
  fontFamily: sansStack,
  fontSize: "12px",
  fontWeight: 400 as const,
  letterSpacing: "0.02em",
  lineHeight: "16px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const textWrapper = {
  backgroundColor: "#ffffff",
  margin: "0",
  padding: "0 24px",
};

const textHeadline = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "21px",
  fontWeight: 500 as const,
  lineHeight: "28px",
  margin: "0 0 10px",
};

const textSummary = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "17px",
  fontWeight: 400 as const,
  lineHeight: "26px",
  margin: "0 0 10px",
};

const textMeta = {
  color: "#525252",
  fontFamily: sansStack,
  fontSize: "12px",
  fontWeight: 400 as const,
  letterSpacing: "0.02em",
  lineHeight: "16px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const divider = {
  borderTop: "1px solid #d7d7d7",
  margin: "20px 24px 20px",
  padding: "0",
};
