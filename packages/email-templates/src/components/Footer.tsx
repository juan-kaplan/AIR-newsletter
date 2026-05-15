import { Link, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  unsubscribeUrl: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <Section style={section}>
      <Text style={brand}>AIR Robótica · Universidad de San Andrés</Text>
      <Text style={text}>
        Recibís este boletín porque estás suscripto al newsletter de AIR
        Robótica.
      </Text>
      <Text style={text}>
        <Link href={unsubscribeUrl} style={link}>
          Cancelar suscripción
        </Link>
      </Text>
    </Section>
  );
}

const section = {
  backgroundColor: "#f8fafc",
  borderTop: "1px solid #d9e0ea",
  margin: "38px -32px -40px",
  padding: "28px 32px 24px",
  textAlign: "center" as const,
};

const brand = {
  color: "#172033",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "20px",
  fontWeight: "700",
  lineHeight: "26px",
  margin: "0 0 14px",
};

const text = {
  color: "#5d697c",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const link = {
  color: "#0b5f94",
};
