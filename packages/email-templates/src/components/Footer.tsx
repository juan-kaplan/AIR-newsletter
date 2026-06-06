import { Link, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  unsubscribeUrl: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <Section style={section}>
      <Section style={rule} />
      <Text style={copyright}>
        © 2026 AIR Club UdeSA · Universidad de San Andrés
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

const bodyStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const monoStack =
  "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const section = {
  backgroundColor: "#f1f3f5",
  borderTop: "1px solid #cbd5e1",
  margin: "32px 0 0",
  padding: "40px 24px 56px",
  textAlign: "center" as const,
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
