# AIR Newsletter Handoff

Generated: 2026-06-06T20:57:14Z / 2026-06-06 17:57 America/Argentina/Buenos_Aires

## Current Goal

Create Juan's own GitHub repo for this AIR newsletter project, push the adapted code there, and continue setup from another session/computer.

The current local repo still has:

```txt
origin https://github.com/jerecoder/AIR-newsletter.git
```

Do not push to that remote. Create a new GitHub repo owned by Juan, then repoint `origin` or add a new remote before pushing.

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

## Current Git State

Changes are uncommitted.

Before pushing to Juan's repo:

1. Create a new GitHub repo under Juan's account.
2. Repoint `origin` away from `jerecoder/AIR-newsletter`.
3. Commit the current implementation.
4. Push `main` to the new remote.
5. Configure GitHub Actions secrets and vars in the new repo.

Suggested commit message:

```txt
feat: adapt newsletter for air club ai robotics
```

Suggested new repo name:

```txt
AIR-newsletter
```

Suggested GitHub Actions secrets:

```txt
SMTP_PASSWORD
WORKER_BASE_URL
WORKER_ADMIN_TOKEN
GEMINI_API_KEY
NVIDIA_API_KEY
```

Suggested GitHub Actions vars:

```txt
MAX_RECIPIENTS=30
MAX_EMAILS_PER_RUN=35
NEWSLETTER_AI_PROVIDER=none
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
```

## Next Session Checklist

1. Run `git status --short`.
2. Confirm `HANDOFF.md` exists and read it.
3. Confirm desired GitHub repo owner/name/visibility.
4. Create the repo.
5. Set the remote to Juan's new repo.
6. Commit all current changes.
7. Push `main`.
8. Configure repo secrets/vars.
9. Run GitHub Actions manually:
   - `collect-weekly`
   - `send-newsletter` with dry-run first
10. Only then run a confirmed send.
