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
      imageUrl: "https://2026.robocup.org/wp-content/uploads/2026/01/Team.jpeg",
      source: "RoboCup AR",
      publishedAt: "2026-05-12T00:00:00.000Z",
      category: "competition",
      selectionReason: "primera competencia nacional con cupo para AIR",
    },
    {
      title:
        "Talk abierta: control de cuadrúpedos con aprendizaje por refuerzo",
      url: "https://example.com/talk-quadruped",
      summary:
        "Investigadores del Instituto Balseiro presentan resultados de transferencia sim-a-real en cuadrúpedos. Entrada libre con inscripción.",
      imageUrl:
        "https://images.unsplash.com/photo-1546776230-bb86256870ce?auto=format&fit=crop&w=1200&q=80",
      source: "Instituto Balseiro",
      publishedAt: "2026-05-18T00:00:00.000Z",
      category: "event",
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
      title: "ROS 2 Kilted Kaiju entra en soporte LTS con un nuevo planner",
      url: "https://example.com/ros-kilted",
      summary:
        "La nueva versión LTS de ROS 2 mejora el rendimiento de tf2 y trae un planner por defecto basado en MoveIt 2.13.",
      imageUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      source: "Open Robotics",
      publishedAt: "2026-05-09T00:00:00.000Z",
      category: "tooling",
    },
    {
      title:
        "Tesla Optimus alcanza 600 horas continuas en planta sin intervención",
      url: "https://example.com/optimus-uptime",
      summary:
        "Tesla publicó datos de uptime de Optimus Gen 3 en líneas de baterías. Cifras llaman atención pero faltan benchmarks externos.",
      imageUrl:
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
      source: "Reuters",
      publishedAt: "2026-05-11T00:00:00.000Z",
      category: "industry",
    },
    {
      title: "NVIDIA libera GR00T-N1 para entrenamiento de humanoides en sim",
      url: "https://example.com/groot-n1",
      summary:
        "Modelo VLA open-weights de 2.3B parámetros, entrenado en 5000 horas de teleoperación. Funciona out-of-the-box con Isaac Lab.",
      imageUrl:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      source: "NVIDIA Research",
      publishedAt: "2026-05-08T00:00:00.000Z",
      category: "research",
    },
    {
      title: "Convocatoria abierta: Hackathon de manipulación con UR5",
      url: "https://example.com/hackathon-ur5",
      summary:
        "ITBA + UTN organizan hackathon de 48hs con brazos UR5e prestados por Universal Robots. Inscripción cierra el 25 de mayo.",
      imageUrl:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      source: "ITBA",
      publishedAt: "2026-05-14T00:00:00.000Z",
      category: "competition",
    },
    {
      title:
        "Boston Dynamics Atlas eléctrico aprende a caminar sobre superficies inestables",
      url: "https://example.com/atlas-electric",
      summary:
        "Demo de 3 minutos sobre rampas, arena y rocas. Política entrenada con 2 semanas de RL en simulación, sin fine-tuning real.",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      source: "Boston Dynamics",
      publishedAt: "2026-05-07T00:00:00.000Z",
      category: "industry",
    },
  ],
};
