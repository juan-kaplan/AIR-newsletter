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
                        src="https://raw.githubusercontent.com/juan-kaplan/AIR-newsletter/main/content/media/LogoRosa.png"
                        style={brandLogo}
                        width={140}
                      />
                    </td>
                    <td style={headerRightCell}>
                      <Text style={headerKicker}>Boletín</Text>
                      <Text style={headerMonth}>
                        {issueMonth ?? ""}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Section style={crimsonBar} />
            {children}
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

const syneStack = "'Syne', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const outfitStack = "'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const monoStack = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const body = {
  backgroundColor: "#faf8f8",
  color: "#1a0810",
  fontFamily: outfitStack,
  margin: 0,
  padding: "0",
};

const shell = {
  padding: "0",
};

const container = {
  backgroundColor: "#faf8f8",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
  width: "600px",
};

const header = {
  backgroundColor: "#ffffff",
  padding: "28px 32px 24px",
};

const headerTable = {
  width: "100%",
};

const headerLeftCell = {
  verticalAlign: "middle" as const,
};

const brandLogo = {
  display: "block",
  height: "auto",
  margin: "0",
  maxWidth: "140px",
  width: "140px",
};

const headerRightCell = {
  textAlign: "right" as const,
  verticalAlign: "middle" as const,
};

const headerKicker = {
  color: "#a40c4c",
  fontFamily: monoStack,
  fontSize: "10px",
  fontWeight: 700 as const,
  letterSpacing: "0.2em",
  lineHeight: "12px",
  margin: "0 0 4px",
  textAlign: "right" as const,
  textTransform: "uppercase" as const,
};

const headerMonth = {
  color: "#1a0810",
  fontFamily: syneStack,
  fontSize: "22px",
  fontWeight: 800 as const,
  letterSpacing: "-0.02em",
  lineHeight: "24px",
  margin: "0",
  textAlign: "right" as const,
};

const crimsonBar = {
  backgroundColor: "#a40c4c",
  height: "3px",
  lineHeight: "3px",
  fontSize: "0",
};

const baseStyles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
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
  .fluid-img {
    height: auto !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
`;
