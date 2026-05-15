import type { NewsletterIssue } from "../../newsletter/src/types";

export const sampleIssue: NewsletterIssue = {
  slug: "robotics-newsletter-sample",
  subject:
    "Robots humanoides en producción y la carrera por estandarizar el aprendizaje físico",
  preheader:
    "Esta semana: una competencia universitaria con becas para San Andrés, papers que vale la pena leer y los anuncios que mueven al sector.",
  articles: [
    {
      title: "Abren las inscripciones para la RoboCup Argentina 2026",
      url: "https://example.com/robocup-argentina",
      summary:
        "La sede será Buenos Aires en septiembre. Hay becas de inscripción para equipos universitarios y una nueva liga de manipulación con brazos cobotic.",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      source: "RoboCup AR",
      publishedAt: "2026-05-12T00:00:00.000Z",
      category: "competition",
      selectionReason: "primera competencia nacional con cupo para AIR",
    },
    {
      title: "Talk abierta: control de cuadrúpedos con aprendizaje por refuerzo",
      url: "https://example.com/talk-quadruped",
      summary:
        "Investigadores del Instituto Balseiro presentan resultados de transferencia sim-a-real en cuadrúpedos. Entrada libre con inscripción.",
      imageUrl:
        "https://images.unsplash.com/photo-1581090700227-1e8e3a37b4d2?auto=format&fit=crop&w=1200&q=80",
      source: "Instituto Balseiro",
      publishedAt: "2026-05-18T00:00:00.000Z",
      category: "event",
      selectionReason: "evento técnico relevante para el club",
    },
    {
      title:
        "Figure AI muestra a su humanoide armando una caja de cereales sin teleoperación",
      url: "https://example.com/figure-cereal",
      summary:
        "Es la primera demo pública de Helix 02 en una tarea de empaquetado completa. El video muestra recuperación autónoma ante errores de agarre.",
      imageUrl:
        "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=1200&q=80",
      source: "The Robot Report",
      publishedAt: "2026-05-13T00:00:00.000Z",
      category: "industry",
    },
    {
      title:
        "Un paper de DeepMind propone un benchmark unificado para manipulación móvil",
      url: "https://example.com/deepmind-benchmark",
      summary:
        "Cubre 200 tareas en simulador y 40 en hardware real. La promesa: comparar arquitecturas VLA sin truquear el setup experimental.",
      imageUrl:
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
      source: "arXiv",
      publishedAt: "2026-05-10T00:00:00.000Z",
      category: "research",
    },
    {
      title: "ROS 2 Kilted Kaiju entra en soporte LTS",
      url: "https://example.com/ros-kilted",
      summary:
        "La nueva versión LTS de ROS 2 mejora el rendimiento de tf2 y trae un planner por defecto basado en MoveIt 2.13.",
      source: "Open Robotics",
      publishedAt: "2026-05-09T00:00:00.000Z",
      category: "tooling",
    },
  ],
};
