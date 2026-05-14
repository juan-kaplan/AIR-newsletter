import { Link, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  unsubscribeUrl: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <Section style={section}>
      <Text style={text}>
        You are receiving this because you subscribed to Automatic Newsletter.
      </Text>
      <Text style={text}>
        <Link href={unsubscribeUrl} style={link}>
          Unsubscribe
        </Link>
      </Text>
    </Section>
  );
}

const section = {
  borderTop: "1px solid #e5e7eb",
  paddingTop: "20px"
};

const text = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px"
};

const link = {
  color: "#0f766e"
};
