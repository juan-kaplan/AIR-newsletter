# Cómo agregar una noticia del club al boletín

Copiá este archivo, completá los campos y guardalo como un nuevo `.md` en esta carpeta.
El sistema lo levantará automáticamente en la próxima corrida de colección.

El archivo `TEMPLATE.md` es solo documentación y nunca se publica.
Solo los archivos con extensión `.md` que no sean este template se incluyen.

---

## Campos disponibles

```
title: Título visible en el boletín (requerido)
url: https://link-al-contenido.com (requerido)
summary: Una o dos oraciones que aparecen debajo del título. (requerido)
source: Nombre de quien publica (opcional, ej: AIR Club UdeSA)
publishedAt: 2026-06-01T00:00:00.000Z (opcional, formato ISO 8601)
category: event (opcional — valores: event, competition, research, tooling, industry)
```

## Ejemplo

```
title: Hackathon de visión por computadora — inscripción abierta
url: https://air.udesa.edu.ar/hackathon-vision-2026
summary: El club organiza un hackathon de 24hs sobre visión por computadora. Abierto a todos los estudiantes de UdeSA. Inscripción cierra el 20 de junio.
source: AIR Club UdeSA
publishedAt: 2026-06-05T12:00:00.000Z
category: competition
```

## Categorías

| Valor | Cuándo usarlo |
|-------|--------------|
| `event` | Charlas, reuniones, workshops del club (default) |
| `competition` | Hackathons y competencias con inscripción |
| `research` | Papers, proyectos de investigación |
| `tooling` | Herramientas, librerías, tutoriales técnicos |
| `industry` | Noticias de empresas o productos |
