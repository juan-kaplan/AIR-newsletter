import type { NewsletterIssue } from "../../newsletter/src/types";

export const sampleIssue: NewsletterIssue = {
  slug: "robotics-newsletter-sample",
  subject: "Boletín AIR Robótica - edición de prueba",
  preheader:
    "Noticias, oportunidades y recursos técnicos para el club de robótica de la Universidad de San Andrés.",
  articles: [
    {
      title: "El flujo del boletín ya está conectado",
      url: "https://example.com/newsletter-pipeline",
      summary:
        "Esta edición de prueba confirma que la recolección, la curaduría, el render y el envío de prueba funcionan juntos.",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      source: "Carga manual",
      publishedAt: "2026-05-01T00:00:00.000Z",
      selectionReason: "permite revisar el diseño antes del envío mensual",
    },
    {
      title: "Las notas manuales siguen siendo simples",
      url: "https://example.com/manual-content",
      summary:
        "El club puede sumar apuntes en Markdown y combinarlos con fuentes automáticas sin cambiar el flujo de envío.",
      imageUrl:
        "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?auto=format&fit=crop&w=1200&q=80",
      source: "Carga manual",
      publishedAt: "2026-05-02T00:00:00.000Z",
      selectionReason: "ayuda a sumar criterio local a la curaduría automática",
    },
  ],
};
