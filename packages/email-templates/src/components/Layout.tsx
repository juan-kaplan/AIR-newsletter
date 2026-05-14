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
          <Section style={masthead}>
            <Text style={eyebrow}>AIR Robotics Club</Text>
            <Text style={brand}>Kinetic Robotics Brief</Text>
            <Text style={tagline}>Competitions, opportunities, and buildable robotics ideas.</Text>
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#08111f",
  color: "#dbeafe",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0
};

const container = {
  backgroundColor: "#0b1220",
  border: "1px solid #1e3a5f",
  borderRadius: "14px",
  margin: "32px auto",
  maxWidth: "640px",
  overflow: "hidden",
  padding: "0 28px 30px"
};

const masthead = {
  backgroundColor: "#101827",
  borderBottom: "1px solid #1f9bd1",
  margin: "0 -28px 28px",
  padding: "26px 28px 24px"
};

const eyebrow = {
  color: "#8ffcff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0",
  margin: "0 0 8px",
  textTransform: "uppercase" as const
};

const brand = {
  color: "#ffffff",
  fontSize: "30px",
  fontWeight: "800",
  lineHeight: "36px",
  margin: "0 0 8px"
};

const tagline = {
  color: "#a7f3d0",
  fontSize: "14px",
  lineHeight: "21px",
  margin: 0
};
