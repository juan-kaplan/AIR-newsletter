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
  issueDate?: string;
}

export function Layout({ children, preheader, issueDate }: LayoutProps) {
  return (
    <Html>
      <Head>
        <style>{baseStyles}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={body}>
        <Section style={shell}>
          <Container className="email-container" style={container}>
            <Section style={topAccent} />
            <Section style={topBar}>
              <table
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={topBarTable}
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style={topBarBrand}>
                      <span style={topBarBrandLogo}>AIR</span>
                      <span style={topBarBrandSeparator}>—</span>
                      <span style={topBarBrandLabel}>Robótica Universitaria</span>
                    </td>
                    <td style={topBarDate}>{issueDate ?? "Mayo 2026"}</td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Section style={masthead}>
              <Text style={mastheadTitle}>AIR Robótica</Text>
              <Text style={mastheadTagline}>
                Boletín semanal · Universidad de San Andrés
              </Text>
            </Section>
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const serifStack =
  "Georgia, 'Times New Roman', Times, ui-serif, serif";
const sansStack =
  "'Helvetica Neue', Helvetica, system-ui, 'Segoe UI', Arial, sans-serif";

const body = {
  backgroundColor: "#f2f2f2",
  color: "#0d0d0d",
  fontFamily: serifStack,
  margin: 0,
  padding: "0",
};

const shell = {
  padding: "20px 0 40px",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
  width: "600px",
};

const topAccent = {
  backgroundColor: "#e3120b",
  height: "6px",
  lineHeight: "6px",
  fontSize: "0",
  margin: "0",
  padding: "0",
};

const topBar = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d7d7d7",
  padding: "14px 24px 12px",
};

const topBarTable = {
  width: "100%",
};

const topBarBrand = {
  color: "#0d0d0d",
  fontFamily: sansStack,
  fontSize: "13px",
  letterSpacing: "0.02em",
  textAlign: "left" as const,
  verticalAlign: "middle" as const,
};

const topBarBrandLogo = {
  color: "#0d0d0d",
  fontFamily: sansStack,
  fontSize: "18px",
  fontWeight: 800 as const,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
};

const topBarBrandSeparator = {
  color: "#a3a3a3",
  margin: "0 8px",
};

const topBarBrandLabel = {
  color: "#525252",
  fontFamily: sansStack,
  fontSize: "12px",
  fontWeight: 500 as const,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
};

const topBarDate = {
  color: "#0d0d0d",
  fontFamily: sansStack,
  fontSize: "14px",
  fontWeight: 500 as const,
  textAlign: "right" as const,
  verticalAlign: "middle" as const,
};

const masthead = {
  backgroundColor: "#F5F4EF",
  padding: "36px 24px 32px",
  textAlign: "center" as const,
};

const mastheadTitle = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "38px",
  fontStyle: "normal" as const,
  fontWeight: 400 as const,
  letterSpacing: "-0.01em",
  lineHeight: "44px",
  margin: "0",
  textAlign: "center" as const,
};

const mastheadTagline = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "17px",
  fontWeight: 400 as const,
  lineHeight: "22px",
  margin: "8px 0 0",
  textAlign: "center" as const,
};

const baseStyles = `
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
}
img {
  -ms-interpolation-mode: bicubic;
  border: 0;
  display: block;
  outline: none;
  text-decoration: none;
}
a {
  text-decoration: none;
}
@media screen and (max-width: 600px) {
  .email-container {
    width: 100% !important;
    margin: auto !important;
  }
  .stack {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  .fluid-img {
    height: auto !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
`;
