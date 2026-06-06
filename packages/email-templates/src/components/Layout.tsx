import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  preheader: string;
  issueMonth?: string;
}

export function Layout({ children, preheader, issueMonth }: LayoutProps) {
  return (
    <Html>
      <Head>
        <style>{baseStyles}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={body}>
        <Section style={shell}>
          <Container className="email-container" style={container}>
            <Section style={header}>
              <table
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={headerTable}
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style={headerLeftCell}>
                      <Img
                        alt="AIR Club UdeSA"
                        src="cid:air-logo"
                        style={brandLogo}
                        width={132}
                      />
                    </td>
                    <td style={headerRightCell}>
                      <Text style={headerKicker}>Newsletter</Text>
                      <Text style={headerMonth}>
                        {issueMonth ?? "Mayo 2026"}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const headlineStack =
  "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const bodyStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const monoStack = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const body = {
  backgroundColor: "#f1f3f5",
  color: "#041627",
  fontFamily: bodyStack,
  margin: 0,
  padding: "0",
};

const shell = {
  padding: "0",
};

const container = {
  backgroundColor: "#f1f3f5",
  margin: "0 auto",
  maxWidth: "640px",
  padding: "0",
  width: "640px",
};

const header = {
  backgroundColor: "#ffffff",
  borderBottom: "2px solid #041627",
  padding: "32px 24px 30px",
};

const headerTable = {
  width: "100%",
};

const headerLeftCell = {
  paddingRight: "16px",
  verticalAlign: "middle" as const,
};

const brandLogo = {
  display: "block",
  height: "auto",
  margin: "0",
  maxWidth: "132px",
  width: "132px",
};

const headerRightCell = {
  borderLeft: "1px solid #cbd5e1",
  paddingLeft: "20px",
  textAlign: "right" as const,
  verticalAlign: "middle" as const,
  width: "240px",
};

const headerKicker = {
  color: "#2563eb",
  fontFamily: monoStack,
  fontSize: "12px",
  fontWeight: 700 as const,
  letterSpacing: "0.18em",
  lineHeight: "14px",
  margin: "0 0 6px",
  textAlign: "right" as const,
  textTransform: "uppercase" as const,
};

const headerMonth = {
  color: "#041627",
  fontFamily: headlineStack,
  fontSize: "26px",
  fontWeight: 700 as const,
  letterSpacing: "-0.02em",
  lineHeight: "28px",
  margin: "0",
  textAlign: "right" as const,
};

const baseStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700&display=swap');
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
@media screen and (max-width: 640px) {
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
