import { Link, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  unsubscribeUrl: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <Section style={section}>
      <Section style={brandRow}>
        <Text style={brandText}>
          <span style={brandMark}>AIR</span>
          <span style={brandSeparator}>/</span>
          <span style={brandLabel}>LABORATORY</span>
        </Text>
      </Section>
      <Section style={rule} />
      <Text style={copyright}>
        © 2026 AIR Robótica · Universidad de San Andrés
      </Text>
      <Text style={department}>
        Departamento de Ingeniería &amp; Inteligencia Artificial
      </Text>
      <Text style={linksRow}>
        <Link href={unsubscribeUrl} style={footLink}>
          Unsubscribe
        </Link>
        <span style={linkSeparator}>·</span>
        <Link href={unsubscribeUrl} style={footLink}>
          Preferences
        </Link>
        <span style={linkSeparator}>·</span>
        <Link href={unsubscribeUrl} style={footLink}>
          Privacy
        </Link>
      </Text>
    </Section>
  );
}

const headlineStack =
  "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const bodyStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const monoStack =
  "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const section = {
  backgroundColor: "#f1f3f5",
  borderTop: "1px solid #cbd5e1",
  margin: "32px 0 0",
  padding: "48px 24px 56px",
  textAlign: "center" as const,
};

const brandRow = {
  margin: "0 0 16px",
  padding: "0",
  textAlign: "center" as const,
};

const brandText = {
  margin: "0",
  textAlign: "center" as const,
};

const brandMark = {
  color: "#041627",
  fontFamily: headlineStack,
  fontSize: "24px",
  fontWeight: 700 as const,
  letterSpacing: "-0.02em",
};

const brandSeparator = {
  color: "#64748b",
  fontFamily: monoStack,
  fontSize: "16px",
  margin: "0 6px",
};

const brandLabel = {
  color: "#475569",
  fontFamily: monoStack,
  fontSize: "11px",
  fontWeight: 500 as const,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};

const rule = {
  borderTop: "1px solid #cbd5e1",
  fontSize: "0",
  lineHeight: "0",
  margin: "0 auto 20px",
  padding: "0",
  width: "96px",
};

const copyright = {
  color: "#475569",
  fontFamily: bodyStack,
  fontSize: "13px",
  fontWeight: 400 as const,
  lineHeight: "20px",
  margin: "0 0 6px",
  textAlign: "center" as const,
};

const department = {
  color: "#475569",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 500 as const,
  letterSpacing: "0.08em",
  lineHeight: "14px",
  margin: "0 0 32px",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};

const linksRow = {
  color: "#475569",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 500 as const,
  letterSpacing: "0.14em",
  lineHeight: "14px",
  margin: "0",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};

const footLink = {
  borderBottom: "1px solid #475569",
  color: "#475569",
  fontFamily: monoStack,
  paddingBottom: "1px",
  textDecoration: "none",
};

const linkSeparator = {
  color: "#cbd5e1",
  margin: "0 10px",
};
