# Automatic Newsletter

Automatic Newsletter is a repo-first weekly newsletter system designed to stay on free-tier infrastructure for a small list: up to 30 subscribers and 35 attempted sends per run.

## Architecture

- GitHub repo stores source, content, tests, and workflows.
- GitHub Actions runs CI and the scheduled sender.
- Cloudflare Worker exposes subscribe, unsubscribe, health, and admin endpoints.
- Cloudflare D1 stores subscribers, issues, delivery records, and audit events.
- Resend sends one email per subscriber so each message has a unique unsubscribe URL.
- React Email renders the HTML email and a plain text companion.

No Supabase, Postgres, Prisma, Vercel, Next.js, Stripe, SES, Listmonk, paid hosting, or full admin dashboard is included.

## Free-Tier Assumptions

This project is sized for roughly 120-150 emails per month. Keep the hard limits at:

- `MAX_RECIPIENTS=30`
- `MAX_EMAILS_PER_RUN=35`

The sender refuses to run if active subscribers or planned sends exceed those limits.

## Setup Requirements

Required accounts:

- GitHub
- Cloudflare
- Resend

Required local tools:

- Node 22
- pnpm through Corepack
- Wrangler through the project package scripts

Enable pnpm if needed:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

Install dependencies:

```bash
pnpm install
```

## Secrets

Never commit real secrets. Copy `.env.example` to a private local `.env` only if you need it for local commands.

GitHub Actions secrets:

```txt
RESEND_API_KEY
NEWSLETTER_FROM
WORKER_BASE_URL
WORKER_ADMIN_TOKEN
```

Optional GitHub repository variables:

```txt
MAX_RECIPIENTS
MAX_EMAILS_PER_RUN
```

Worker secret:

```txt
WORKER_ADMIN_TOKEN
```

## Cloudflare D1

Create the D1 database:

```bash
npx wrangler login
npx wrangler d1 create automatic-newsletter-db
```

Copy the returned database UUID into `apps/worker/wrangler.toml`:

```toml
name = "automatic-newsletter"

[[d1_databases]]
binding = "DB"
database_name = "automatic-newsletter-db"
database_id = "<D1_DATABASE_ID>"
migrations_dir = "migrations"
```

Apply migrations:

```bash
pnpm --filter @newsletter/worker cf:migrate:remote
```

For local development:

```bash
pnpm --filter @newsletter/worker cf:migrate:local
```

## Deploy Worker

Deploy:

```bash
pnpm --filter @newsletter/worker cf:deploy
```

Add the admin token as a Worker secret:

```bash
npx wrangler secret put WORKER_ADMIN_TOKEN --config apps/worker/wrangler.toml
```

Test the Worker:

```bash
curl https://<your-worker-url>/health
```

Then add the deployed URL to GitHub Actions as `WORKER_BASE_URL`.

## Resend

Verify a sending subdomain such as `updates.<your-domain.com>` in Resend, then create a sending-only API key.

Use a sender value like:

```txt
Your Newsletter <newsletter@updates.<your-domain.com>>
```

Store it as `NEWSLETTER_FROM`.

## Newsletter Commands

Preview the current deterministic issue:

```bash
pnpm newsletter:preview
```

Send a test email:

```bash
pnpm newsletter:send-test --to someone@example.com
```

Dry run:

```bash
pnpm newsletter:send --dry-run
```

Production send:

```bash
pnpm newsletter:send --confirm
```

Sending defaults to dry-run unless `--confirm` is passed.

## GitHub Actions

CI runs on pushes to `main` and pull requests:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
```

The weekly send workflow runs on Monday at `10:17 America/Argentina/Buenos_Aires` and can also be triggered manually. Use the manual `dry_run` input for safe checks.

## Unsubscribe

The Worker generates a random unsubscribe token, stores only its SHA-256 hash in D1, and returns unsubscribe URLs only through the admin subscriber endpoint. Each sent email includes both `List-Unsubscribe` and `List-Unsubscribe-Post` headers. A raw token is never stored in D1.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm newsletter:preview
pnpm newsletter:send --dry-run
```
