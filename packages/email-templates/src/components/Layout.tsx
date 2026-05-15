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
              <Text style={brand}>AIR Robótica</Text>
              <Text style={eyebrow}>Universidad de San Andrés</Text>
            </Section>
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#eef1f4",
  color: "#1f2933",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "0",
};

const shell = {
  padding: "24px 0 56px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #d7dde5",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
  padding: "0",
  width: "600px",
};

const masthead = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d7dde5",
  padding: "30px 40px 24px",
};

const eyebrow = {
  color: "#607083",
  fontSize: "13px",
  fontWeight: "400",
  letterSpacing: "0",
  lineHeight: "19px",
  margin: "4px 0 0",
};

const brand = {
  color: "#12344d",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "34px",
  margin: 0,
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
