import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  preheader: string;
}

export function Layout({ children, preheader }: LayoutProps) {
  return (
    <Html>
      <Head>
        <style>{cerberusStyles}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={body}>
        <Section style={shell}>
          <Container className="email-container" style={container}>
            <Section style={masthead}>
              <Text style={eyebrow}>Universidad de San Andrés</Text>
              <Text style={brand}>AIR Robótica</Text>
              <Text style={tagline}>Boletín de robótica universitaria</Text>
            </Section>
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#e7edf4",
  color: "#17212b",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "0",
};

const shell = {
  padding: "28px 0 60px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ccd6e2",
  borderRadius: "14px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
  padding: "0",
  width: "600px",
};

const masthead = {
  backgroundColor: "#102f49",
  borderBottom: "6px solid #6db7dc",
  padding: "32px 40px 30px",
};

const eyebrow = {
  color: "#b9d8ea",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.06em",
  lineHeight: "16px",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};

const brand = {
  color: "#ffffff",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "34px",
  fontWeight: "800",
  letterSpacing: "-0.02em",
  lineHeight: "38px",
  margin: "0",
};

const tagline = {
  color: "#dceaf2",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "8px 0 0",
};

// Cerberus-inspired email basics: centered 600px container, inline-first
// styling, and a small mobile override for clients that support media queries.
const cerberusStyles = `
html,
body {
  margin: 0 auto !important;
  padding: 0 !important;
  width: 100% !important;
}
* {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
table,
td {
  mso-table-lspace: 0pt !important;
  mso-table-rspace: 0pt !important;
}
table {
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  margin: 0 auto !important;
}
img {
  -ms-interpolation-mode: bicubic;
}
a {
  text-decoration: none;
}
@media screen and (max-width: 600px) {
  .email-container {
    width: 100% !important;
    margin: auto !important;
  }
  .mobile-padding {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
  .fluid-img {
    height: auto !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
`;
