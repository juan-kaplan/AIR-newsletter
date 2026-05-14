import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
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
          <Section>
            <Text style={eyebrow}>Automatic Newsletter</Text>
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f8fafc",
  color: "#111827",
  fontFamily: "Arial, sans-serif",
  margin: 0
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  margin: "32px auto",
  maxWidth: "600px",
  padding: "32px"
};

const eyebrow = {
  color: "#4b5563",
  fontSize: "13px",
  letterSpacing: "0",
  margin: "0 0 16px"
};
