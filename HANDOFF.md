# AIR Newsletter Handoff

Generated: 2026-06-06T20:57:14Z / 2026-06-06 17:57 America/Argentina/Buenos_Aires

## Current State

Juan's own GitHub repo has been created and the adapted code has been pushed.

New repo:

```txt
https://github.com/juan-kaplan/AIR-newsletter
visibility: public
default branch: main
```

Local remotes:

```txt
origin   https://github.com/juan-kaplan/AIR-newsletter.git
upstream https://github.com/jerecoder/AIR-newsletter.git
```

Pushed commit:

```txt
e66ddfa feat: adapt newsletter for air club ai robotics
```

First GitHub Actions CI run on the new repo passed:

```txt
CI success, run id 27073774937
```

## Implemented Adaptation

The newsletter was adapted from robotics-only to AIR Club UdeSA's AI + Robotics focus.

Main behavior changes:

- Added AI RSS feeds and hackathon pages to `content/sources.yaml`.
- Expanded RSS relevance to accept robotics OR AI content.
- Added fallback summaries for feeds that provide title/link but no description, especially Hugging Face.
- Added deterministic AI/robotics scoring terms: LLMs, open weights, fine-tuning, benchmarks, computer vision, reinforcement learning, NLP, PyTorch, agents, ROS2-adjacent tooling, and Spanish equivalents.
- Replaced the proposed competition accessibility penalty with a hard reject.
- Competitions are accepted only if clearly remote/virtual/online or physically in Argentina.
- LATAM/South America is only a regional relevance signal, not enough to pass accessibility.
- Removed Gemini from article selection so deterministic ranking remains the source of truth.
- Added optional final text polish provider in `packages/newsletter/src/compose/aiPolish.ts`.
- Supported final polish providers: `none`, `gemini`, `nvidia`.
- Default provider is `none`.
- NVIDIA NIM uses `https://integrate.api.nvidia.com/v1/chat/completions`.
- AI providers rewrite only reader-visible issue text and preserve article URL/source/category/facts.
- Updated branding to AIR Club UdeSA.
- Updated sender/test address from `jfigueiredopaschmann@udesa.edu.ar` to `jkaplan@udesa.edu.ar`.
- Removed the scheduled monthly send trigger; send workflow is manual-only.
- Weekly collection remains scheduled.

## Important Files Changed

- `content/sources.yaml`
- `packages/newsletter/src/collect/rss.ts`
- `packages/newsletter/src/collect/competitionPages.ts`
- `packages/newsletter/src/collect/index.ts`
- `packages/newsletter/src/curate/scoring.ts`
- `packages/newsletter/src/curate/index.ts`
- `packages/newsletter/src/curate/publishingSweeps.ts`
- `packages/newsletter/src/compose/buildIssue.ts`
- `packages/newsletter/src/compose/aiPolish.ts`
- `packages/newsletter/test/aiPolish.test.ts`
- `packages/newsletter/test/curation.test.ts`
- `packages/newsletter/test/rss.test.ts`
- `packages/newsletter/test/renderEmail.test.ts`
- `packages/newsletter/test/sendIssue.test.ts`
- `packages/email-templates/src/components/Footer.tsx`
- `packages/email-templates/src/components/Layout.tsx`
- `packages/email-templates/src/sampleIssue.ts`
- `.env.example`
- `.github/workflows/send-newsletter.yml`
- `.github/workflows/collect-weekly.yml`
- `README.md`

Deleted:

- `packages/newsletter/src/curate/gemini.ts`

Generated/updated by verification:

- `content/curated/weekly/2026-W23.json`

## Verification Completed

These passed after implementation:

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm newsletter:verify-sources
corepack pnpm newsletter:collect
corepack pnpm newsletter:preview
corepack pnpm newsletter:send-test --to jkaplan@udesa.edu.ar --dry-run
```

Test suite result:

```txt
8 test files passed
31 tests passed
```

`newsletter:verify-sources` was made more robust:

- RSS verification now runs sequentially and retries.
- Competition page verification now runs sequentially and retries.
- HTTP 429 during RSS article counting is treated as a soft verification warning if the source is rate-limited.
- RoboCup and Hugging Face were flaky during repeated live checks but verified successfully after reliability changes.

## Send Status

Dry-run passed:

```bash
corepack pnpm newsletter:send-test --to jkaplan@udesa.edu.ar --dry-run
```

Confirmed send was attempted and did not send because required secrets were missing in the local shell:

```txt
WORKER_BASE_URL and WORKER_ADMIN_TOKEN are required for confirmed sending.
```

There is no local `.env` file in this checkout.

To send locally, provide these env vars without committing secrets:

```txt
WORKER_BASE_URL
WORKER_ADMIN_TOKEN
NEWSLETTER_FROM=jkaplan@udesa.edu.ar
SMTP_USER=jkaplan@udesa.edu.ar
SMTP_PASSWORD
SMTP_PORT=465
SMTP_SECURE=true
```

Optional final polish:

```txt
NEWSLETTER_AI_PROVIDER=none|gemini|nvidia
GEMINI_API_KEY
NVIDIA_API_KEY
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
```

## GitHub Actions Setup

Workflows are active on `juan-kaplan/AIR-newsletter`:

- `CI`
- `Collect Weekly AIR Digest`
- `Send Newsletter`

Configured GitHub Actions variables:

```txt
MAX_RECIPIENTS=30
MAX_EMAILS_PER_RUN=35
NEWSLETTER_AI_PROVIDER=none
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
```

GitHub Actions secrets are not configured yet because the private values were not available in this session.

Required secrets for full operation:

```txt
SMTP_PASSWORD
WORKER_BASE_URL
WORKER_ADMIN_TOKEN
GEMINI_API_KEY
NVIDIA_API_KEY
```

## Next Session Checklist

1. Run `git status --short`.
2. Confirm `HANDOFF.md` exists and read it.
3. Pull latest `main` from `origin`.
4. Configure missing GitHub Actions secrets.
5. If Cloudflare Worker is not deployed yet, deploy it and set `WORKER_BASE_URL` / `WORKER_ADMIN_TOKEN`.
6. Create a Gmail app password for `jkaplan@udesa.edu.ar` and set `SMTP_PASSWORD`.
7. Optional: set `NEWSLETTER_AI_PROVIDER=nvidia` and `NVIDIA_API_KEY` only when final text polish should be enabled.
8. Run GitHub Actions manually:
   - `collect-weekly`
   - `send-newsletter` with dry-run first
9. Only then run a confirmed send.
