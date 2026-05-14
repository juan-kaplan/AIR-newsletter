import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
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
            <Text style={eyebrow}>AIR Robotics Club</Text>
            <Text style={brand}>Robotics Monthly</Text>
          </Section>
          <Hr style={rule} />
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#eef2f7",
  color: "#111827",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  margin: "32px auto",
  maxWidth: "640px",
  overflow: "hidden",
  padding: "0 32px 32px"
};

const masthead = {
  backgroundColor: "#0f172a",
  margin: "0 -32px",
  padding: "28px 32px 24px"
};

const eyebrow = {
  color: "#7dd3fc",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
  margin: "0 0 8px",
  textTransform: "uppercase" as const
};

const brand = {
  color: "#ffffff",
  fontSize: "30px",
  fontWeight: "700",
  lineHeight: "36px",
  margin: 0
};

const rule = {
  borderColor: "#e5e7eb",
  margin: "0 -32px 28px"
};
