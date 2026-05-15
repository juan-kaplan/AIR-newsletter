import type { NewsletterArticle } from "../types";

export function runPublishingSweeps(
  articles: NewsletterArticle[],
): NewsletterArticle[] {
  return articles.map((article) =>
    sweepAudienceFit(sweepReaderVisibleText(sweepScrapingArtifacts(article))),
  );
}

function sweepScrapingArtifacts(article: NewsletterArticle): NewsletterArticle {
  return {
    ...article,
    title: cleanTitle(article.title),
    summary: cleanSummary(article.summary),
  };
}

function sweepReaderVisibleText(article: NewsletterArticle): NewsletterArticle {
  return {
    ...article,
    summary: article.summary
      .replace(/\bpor qué importa:?\s*/gi, "")
      .replace(/\bpuede servirle a AIR\s*/gi, "ofrece material para ")
      .replace(/\bpuede servir como modelo para\b/gi, "muestra un modelo para")
      .replace(/\bpuede inspirar a\b/gi, "da pistas para")
      .replace(/señales/gi, "noticias")
      .replace(/señal/gi, "noticia")
      .replace(/\brazón interna\b/gi, "")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

function sweepAudienceFit(article: NewsletterArticle): NewsletterArticle {
  return {
    ...article,
    summary: ensureCompleteSentence(rewriteForAudience(article)),
  };
}

function rewriteForAudience(article: NewsletterArticle): string {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  if (article.category === "competition") {
    const specific = rewriteCompetitionFormula(article);
    return specific
      .replace(
        /\bAIR puede usarlo como referencia para\b/gi,
        "la nota permite comparar",
      )
      .replace(
        /\bpuede servirle a AIR como referencia para\b/gi,
        "la nota permite comparar",
      )
      .replace(/\bpuede servir como modelo para\b/gi, "ofrece un modelo para")
      .replace(
        /\bpuede inspirar a los equipos de AIR a\b/gi,
        "da a los equipos de AIR pistas para",
      );
  }

  if (!looksEnglish(article.summary)) {
    return article.summary;
  }

  if (text.includes("drone regulations") || text.includes("canadian drone")) {
    return "La nota resume cómo se prueban y regulan drones en Canadá, un contexto útil para comparar requisitos de seguridad, operación y validación. Sirve como referencia para pensar reglas si AIR organiza desafíos con drones.";
  }

  if (
    text.includes("honeybee") ||
    text.includes("honeybees") ||
    text.includes("bees") ||
    text.includes("abejas")
  ) {
    return "Investigadores estudian cómo navegan las abejas para mejorar algoritmos de drones autónomos. Para AIR, la nota conecta bioinspiración, percepción y planificación de trayectorias en un caso fácil de discutir en proyectos de vuelo.";
  }

  if (text.includes("animal movement") || text.includes("robotic control")) {
    return "El trabajo busca cerrar la brecha entre el movimiento animal y el control robótico, usando modelos que expliquen cómo cuerpo y cerebro se coordinan. Para el club, es una puerta de entrada a locomoción, control adaptativo y diseño de robots que se mueven en terrenos reales.";
  }

  if (
    text.includes("accountability") ||
    text.includes("why did the robot do that") ||
    text.includes("ros2")
  ) {
    return "La discusión plantea cómo explicar decisiones de robots autónomos en ROS 2: por qué un robot cambia de ruta, frena o aborta una misión. Es material útil para pensar logs, seguridad y depuración en proyectos del club.";
  }

  if (
    text.includes("robot arm") ||
    text.includes("arm specs") ||
    text.includes("manipulation")
  ) {
    return "La nota revisa qué suele fallar cuando las especificaciones de un brazo robótico se llevan a una implementación real. Para AIR, ayuda a mirar más allá de torque, alcance y carga útil, y pensar integración, repetibilidad y entorno.";
  }

  if (article.category === "tooling") {
    return `El material de ${article.source ?? "la fuente"} cubre una herramienta o discusión técnica que puede orientar decisiones de implementación en proyectos de AIR. Conviene revisarlo buscando ideas aplicables a ROS, simulación, integración o depuración.`;
  }

  if (article.category === "research") {
    return "La nota presenta una línea de investigación robótica con posible aplicación en proyectos estudiantiles. Vale leerla buscando qué técnica se podría simplificar, simular o convertir en una prueba concreta para el club.";
  }

  return "La noticia aporta contexto de robótica aplicada para discusiones técnicas del club. Conviene leerla buscando ideas trasladables a prototipos, reglas de competencia o demostraciones para estudiantes.";
}

function rewriteCompetitionFormula(article: NewsletterArticle): string {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  if (text.includes("wall-climbing") || text.includes("trepadores de muros")) {
    return article.summary.replace(
      /Wall-Climbing Robot Challenge 2026 publica una oportunidad vigente hasta el ([^.]+)\. El eje está en robots trepadores de muros, con trabajo fuerte de diseño mecánico, control y percepción\. AIR puede tomar de ahí formatos de prueba, criterios de evaluación y niveles de dificultad para entrenar equipos\./i,
      "El Wall-Climbing Robot Challenge propone diseñar robots capaces de trepar muros, una consigna muy concreta para trabajar adhesión, tracción, control y percepción en superficies verticales. La inscripción cierra el $1.",
    );
  }

  if (text.includes("unsw") && text.includes("robotics")) {
    return article.summary.replace(
      /UNSW Robotics & Coding Challenge 2026 publica una oportunidad vigente\. El eje combina robótica, programación e IA aplicada a una misión de rescate o infraestructura\. AIR puede tomar de ahí formatos de prueba, criterios de evaluación y niveles de dificultad para entrenar equipos\./i,
      "La edición 2026 de la UNSW STEM, Robotics & Coding Challenge plantea una misión de rescate tras el colapso de una ruta. Es un buen caso para estudiar cómo convertir un problema abierto en reglas, restricciones técnicas y entregables evaluables.",
    );
  }

  if (text.includes("robocup")) {
    return article.summary.replace(
      /RoboCup 2026 publica una oportunidad vigente\. El eje reúne ligas de robótica competitiva como fútbol, rescate, robótica doméstica e industrial\. AIR puede tomar de ahí formatos de prueba, criterios de evaluación y niveles de dificultad para entrenar equipos\./i,
      "RoboCup 2026 reúne ligas de fútbol, rescate, robótica doméstica e industrial. Más que una sola competencia, funciona como un mapa de categorías posibles para pensar pruebas universitarias con distintos niveles de dificultad.",
    );
  }

  return article.summary;
}

function looksEnglish(value: string): boolean {
  return /\b(the|and|with|from|researchers|students|drone|drones|robots?|challenge|system|systems|control|navigation|technology)\b/i.test(
    value,
  );
}

function cleanTitle(value: string): string {
  const cleaned = decodeEntities(value).replace(/\s+/g, " ").trim();
  if (cleaned === cleaned.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(cleaned)) {
    return titleCase(cleaned);
  }

  return cleaned;
}

function cleanSummary(value: string): string {
  return truncateAtSentence(
    decodeEntities(value)
      .replace(
        /\b(skip to main content|register now|sign in|menu|faq|sponsors?|privacy policy|terms of service)\b/gi,
        " ",
      )
      .replace(/\s+/g, " ")
      .trim(),
    420,
  );
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}

function truncateAtSentence(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return ensureCompleteSentence(value);
  }

  const sentenceEnd = Math.max(
    value.lastIndexOf(". ", maxLength),
    value.lastIndexOf("? ", maxLength),
    value.lastIndexOf("! ", maxLength),
  );
  if (sentenceEnd >= 120) {
    return value.slice(0, sentenceEnd + 1).trim();
  }

  return `${value
    .slice(0, maxLength)
    .replace(/\s+\S*$/, "")
    .trim()}...`;
}

function ensureCompleteSentence(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function titleCase(value: string): string {
  const smallWords = new Set([
    "and",
    "or",
    "the",
    "of",
    "for",
    "to",
    "in",
    "with",
    "a",
    "an",
  ]);
  return value
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index > 0 && smallWords.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}
