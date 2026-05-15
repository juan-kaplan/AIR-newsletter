import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Row,
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
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={masthead}>
            <Row>
              <Column>
                <Text style={brand}>AIR ROBÓTICA</Text>
                <Text style={eyebrow}>Universidad de San Andrés</Text>
              </Column>
              <Column style={editionColumn}>
                <Text style={edition}>Boletín mensual</Text>
              </Column>
            </Row>
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f5f7fb",
  color: "#172033",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "28px 0 64px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #d9e0ea",
  margin: "0 auto",
  maxWidth: "680px",
  overflow: "hidden",
  padding: "0 32px 40px",
};

const masthead = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #d9e0ea",
  margin: "0 -32px 34px",
  padding: "22px 32px",
};

const eyebrow = {
  color: "#5d697c",
  fontSize: "12px",
  fontWeight: "500",
  letterSpacing: "0",
  margin: "3px 0 0",
  textTransform: "uppercase" as const,
};

const brand = {
  color: "#0b3a5b",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "28px",
  margin: 0,
};

const editionColumn = {
  textAlign: "right" as const,
  verticalAlign: "middle",
};

const edition = {
  border: "1px solid #c8d2df",
  borderRadius: "999px",
  color: "#334155",
  display: "inline-block",
  fontSize: "12px",
  letterSpacing: "0",
  margin: "0",
  padding: "8px 12px",
  textTransform: "uppercase" as const,
};
