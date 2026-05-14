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
  backgroundColor: "#111415",
  color: "#e1e3e4",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "0 0 80px",
};

const container = {
  backgroundColor: "#111415",
  border: "1px solid #2a2a2a",
  margin: "0 auto",
  maxWidth: "800px",
  overflow: "hidden",
  padding: "0 24px 40px",
};

const masthead = {
  backgroundColor: "#111415",
  borderBottom: "1px solid #2a2a2a",
  margin: "0 -24px 40px",
  padding: "18px 24px",
};

const eyebrow = {
  color: "#c1c6d7",
  fontSize: "12px",
  fontWeight: "500",
  letterSpacing: "0",
  margin: "3px 0 0",
  textTransform: "uppercase" as const,
};

const brand = {
  color: "#adc7ff",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "30px",
  margin: 0,
};

const editionColumn = {
  textAlign: "right" as const,
  verticalAlign: "middle",
};

const edition = {
  border: "1px solid #414754",
  borderRadius: "4px",
  color: "#e1e3e4",
  display: "inline-block",
  fontSize: "12px",
  letterSpacing: "0",
  margin: "0",
  padding: "8px 12px",
  textTransform: "uppercase" as const,
};
