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
        Generado para revisión manual por el flujo del boletín de AIR. Cada
        envío resume noticias útiles para aprender, competir y organizar mejores
        actividades de robótica universitaria.
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
  backgroundColor: "#1d2021",
  borderTop: "1px solid #2a2a2a",
  margin: "38px -24px -40px",
  padding: "32px 24px 24px",
  textAlign: "center" as const,
};

const brand = {
  color: "#e1e3e4",
  fontFamily: "Aptos, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "20px",
  fontWeight: "700",
  lineHeight: "26px",
  margin: "0 0 14px",
};

const text = {
  color: "#c1c6d7",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const link = {
  color: "#adc7ff",
};
