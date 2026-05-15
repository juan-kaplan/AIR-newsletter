import { Link, Section, Text } from "@react-email/components";
import React from "react";

interface FooterProps {
  unsubscribeUrl: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <>
      <Section style={section}>
        <Section style={rule} />
        <Text style={brand}>AIR Robótica</Text>
        <Text style={text}>
          Universidad de San Andrés · Vito Dumas 284, Victoria, Buenos Aires
        </Text>
        <Text style={fineprint}>
          Recibís este boletín porque estás suscripto al newsletter semanal de
          AIR Robótica. Si querés dejar de recibirlo,{" "}
          <Link href={unsubscribeUrl} style={link}>
            cancelar suscripción
          </Link>
          .
        </Text>
        <Text style={copyright}>
          © 2026 AIR Robótica · Todos los derechos reservados
        </Text>
      </Section>
      <Section style={bottomAccent} />
    </>
  );
}

const serifStack =
  "Georgia, 'Times New Roman', Times, ui-serif, serif";
const sansStack =
  "'Helvetica Neue', Helvetica, system-ui, 'Segoe UI', Arial, sans-serif";

const section = {
  backgroundColor: "#ffffff",
  margin: "0",
  padding: "28px 24px 36px",
};

const rule = {
  borderTop: "1px solid #d7d7d7",
  margin: "0 0 20px",
  padding: "0",
};

const brand = {
  color: "#0d0d0d",
  fontFamily: serifStack,
  fontSize: "20px",
  fontWeight: 700 as const,
  letterSpacing: "-0.005em",
  lineHeight: "26px",
  margin: "0 0 6px",
};

const text = {
  color: "#0d0d0d",
  fontFamily: sansStack,
  fontSize: "13px",
  fontWeight: 400 as const,
  lineHeight: "20px",
  margin: "0 0 16px",
};

const fineprint = {
  color: "#525252",
  fontFamily: sansStack,
  fontSize: "12px",
  fontWeight: 400 as const,
  lineHeight: "18px",
  margin: "0 0 14px",
};

const link = {
  color: "#0d0d0d",
  fontFamily: sansStack,
  fontWeight: 500 as const,
  textDecoration: "underline",
};

const bottomAccent = {
  backgroundColor: "#e3120b",
  height: "6px",
  lineHeight: "6px",
  fontSize: "0",
  margin: "0",
  padding: "0",
};

const copyright = {
  color: "#737373",
  fontFamily: sansStack,
  fontSize: "11px",
  fontWeight: 400 as const,
  letterSpacing: "0.02em",
  lineHeight: "16px",
  margin: "0",
  textTransform: "uppercase" as const,
};
