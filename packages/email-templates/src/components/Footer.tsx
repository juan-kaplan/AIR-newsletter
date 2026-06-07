import { Section, Text } from "@react-email/components";
import React from "react";

export function Footer() {
  return (
    <Section style={section}>
      <Section style={rule} />
      <Text style={copyright}>
        © 2026 AIR Club UdeSA · Universidad de San Andrés
      </Text>
      <Text style={department}>
        Departamento de Ingeniería &amp; Inteligencia Artificial
      </Text>
    </Section>
  );
}

const outfitStack = "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const monoStack = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const section = {
  backgroundColor: "rgba(221,170,188,0.12)",
  borderTop: "3px solid #a40c4c",
  margin: "24px 0 0",
  padding: "36px 32px 48px",
  textAlign: "center" as const,
};

const rule = {
  fontSize: "0",
  lineHeight: "0",
  margin: "0 auto 16px",
  padding: "0",
  width: "0",
};

const copyright = {
  color: "#8f5261",
  fontFamily: outfitStack,
  fontSize: "13px",
  fontWeight: 400 as const,
  lineHeight: "20px",
  margin: "0 0 6px",
  textAlign: "center" as const,
};

const department = {
  color: "#c08c94",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 500 as const,
  letterSpacing: "0.1em",
  lineHeight: "14px",
  margin: "0",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
