# AIR Club UdeSA — Boletín

Automated newsletter system for [AIR Club UdeSA](https://clubroboticaudesa.netlify.app), the AI and robotics club at Universidad de San Andrés. It scrapes AI and robotics news weekly, curates a monthly issue, and exports a ready-to-send HTML file that goes out via Gmail.

## How it works

```
Weekly cron (Monday)          Manual trigger
       │                            │
collect RSS + competition   build-newsletter.yml
pages → store weekly            │
digest in content/            export HTML
curated/weekly/               artifact
                                    │
                            download & review
                            in browser
                                    │
                            copy-paste into Gmail
                            → send to club members
```

1. **Weekly collection** — GitHub Actions runs every Monday, scrapes all RSS feeds and competition pages defined in `content/sources.yaml`, scores and deduplicates articles, and commits up to 6 curated items to `content/curated/weekly/`.
2. **Monthly build** — Triggered manually from the Actions tab. Pulls the last 4–5 weekly digests, picks the top 10 articles, optionally runs an AI polish pass (Gemini) to generate the editorial intro, renders the HTML email, and uploads it as a downloadable artifact.
3. **Review & send** — Download the artifact, open `newsletter.html` in a browser, review, then copy-paste into Gmail and send to the club contact list.

## Repository layout

```
content/
  sources.yaml              RSS and competition page sources
  curated/weekly/           Stored weekly digests (auto-committed)
  manual/                   Student news submissions (Markdown)
  media/                    Brand assets (logos, color palette)

packages/
  newsletter/               Core pipeline: collect → curate → compose → export
    src/
      collect/              RSS, competition pages, manual markdown
      curate/               Scoring and publishing sweeps
      compose/              Build issue + AI polish (Gemini)
      render/               React Email → HTML + plain text
      export/               Write dist/newsletter.html and newsletter.txt
  email-templates/          React Email components and layout

.github/workflows/
  ci.yml                    Lint + typecheck + test on push/PR
  collect-weekly.yml        Monday 09:30 ART — collect and store digest
  build-newsletter.yml      Manual — export HTML artifact
```

## Newsletter sections

Articles are grouped into sections by category:

| Section | Categories |
|---|---|
| INVESTIGACIÓN | `research` |
| HERRAMIENTAS & INDUSTRIA | `tooling`, `industry` |
| COMPETENCIAS | `competition` |
| DEL CLUB | `event` (manual submissions) |

## Local setup

Requires Node 22 and pnpm via Corepack.

```bash
corepack enable
pnpm install
```

Copy the environment file and fill in your keys:

```bash
cp .env.example .env
```

## Environment variables

```bash
# AI polish — optional. Set to "gemini" to enable the editorial intro.
NEWSLETTER_AI_PROVIDER=none   # none | gemini | nvidia

# Required if NEWSLETTER_AI_PROVIDER=gemini
GEMINI_API_KEY=

# Required if NEWSLETTER_AI_PROVIDER=nvidia
NVIDIA_API_KEY=
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
```

## Commands

```bash
# Verify all RSS and competition page sources are reachable
pnpm newsletter:verify-sources

# Collect this week's articles and store the digest
pnpm newsletter:collect

# Print a plain-text preview of the current issue
pnpm newsletter:preview

# Export newsletter.html and newsletter.txt to packages/newsletter/dist/
pnpm newsletter:export
```

## Adding student news

Drop a Markdown file in `content/manual/` following the template in `content/manual/TEMPLATE.md`. It will be included in the next build under the **DEL CLUB** section.

## GitHub Actions setup

### Secrets

```
GEMINI_API_KEY     Optional — enables the AI editorial intro
```

### Variables

```
NEWSLETTER_AI_PROVIDER    Set to "gemini" to enable AI polish in CI builds
```

Both are optional. Without them the newsletter still builds, just without the AI-generated intro paragraph.

### Running a build

Go to **Actions → Build Newsletter → Run workflow**. The artifact `newsletter-YYYY-MM-DD` will appear when the run completes. Download it, open `newsletter.html` in Chrome, then copy-paste into Gmail.

## Brand assets

Official media kit is in `content/media/`:

| File | Use |
|---|---|
| `LogoRosa.png` | Email header (crimson on white) |
| `LogoBlanco.png` | White logo for dark backgrounds |
| `LogoNegro.png` | Black logo for print |
| `BrazoRosa.png` | Robot arm standalone (crimson) |
| `MiniaturaWeb.png` | Circular avatar / web thumbnail |
| `ColorScheme.png` | Official palette reference |

Color palette: `#a40c4c` · `#ddaabc` · `#ac104c` · `#8f5261` · `#c08c94`
