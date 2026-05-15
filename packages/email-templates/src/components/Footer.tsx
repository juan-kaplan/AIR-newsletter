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
  backgroundColor: "#f6f8fa",
  borderTop: "1px solid #d7dde5",
  margin: "0",
  padding: "30px 40px 34px",
  textAlign: "center" as const,
};

const brand = {
  color: "#1f2933",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "19px",
  fontWeight: "700",
  lineHeight: "25px",
  margin: "0 0 12px",
};

const text = {
  color: "#607083",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const link = {
  color: "#12344d",
  textDecoration: "underline",
};
