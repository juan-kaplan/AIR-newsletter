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
  backgroundColor: "#102f49",
  borderTop: "1px solid #0d273d",
  margin: "0",
  padding: "30px 40px 34px",
  textAlign: "center" as const,
};

const brand = {
  color: "#ffffff",
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "18px",
  fontWeight: "800",
  lineHeight: "24px",
  margin: "0 0 12px",
};

const text = {
  color: "#d0e0eb",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const link = {
  color: "#ffffff",
  textDecoration: "underline",
};
