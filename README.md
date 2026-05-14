# Automatic Newsletter

Automatic Newsletter is a repo-first internal UdeSA newsletter system designed to stay on free-tier infrastructure for a small list: up to 30 subscribers and 35 attempted sends per run.

## Architecture

- GitHub repo stores source, content, tests, and workflows.
- GitHub Actions runs CI and the scheduled sender.
- Cloudflare Worker exposes subscribe, unsubscribe, health, and admin endpoints.
- Cloudflare D1 stores subscribers, issues, delivery records, and audit events.
- Gmail SMTP sends one email per subscriber from `jfigueiredopaschmann@udesa.edu.ar` so each message has a unique unsubscribe URL.
- React Email renders the HTML email and a plain text companion.

No custom domain, Resend, Supabase, Postgres, Prisma, Vercel, Next.js, Stripe, SES, Listmonk, paid hosting, or full admin dashboard is included.

## Free-Tier Assumptions

This project is sized for roughly 120-150 emails per month. Keep the hard limits at:

- `MAX_RECIPIENTS=30`
- `MAX_EMAILS_PER_RUN=35`
- `ALLOWED_RECIPIENT_DOMAIN=udesa.edu.ar`

The Worker rejects non-`@udesa.edu.ar` subscribers. The sender refuses to run if any recipient is outside `@udesa.edu.ar`, or if active subscribers or planned sends exceed the limits.

## Setup Requirements

Required accounts:

- GitHub
- Cloudflare
- Google account with Gmail app password support for `jfigueiredopaschmann@udesa.edu.ar`

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
SMTP_PASSWORD
WORKER_BASE_URL
WORKER_ADMIN_TOKEN
```

The workflow sets these non-secret values directly:

```txt
NEWSLETTER_FROM=jfigueiredopaschmann@udesa.edu.ar
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jfigueiredopaschmann@udesa.edu.ar
ALLOWED_RECIPIENT_DOMAIN=udesa.edu.ar
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

## Gmail SMTP

Create an app password for `jfigueiredopaschmann@udesa.edu.ar` and store it in GitHub Actions as `SMTP_PASSWORD`.

The sender uses:

```txt
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=jfigueiredopaschmann@udesa.edu.ar
NEWSLETTER_FROM=jfigueiredopaschmann@udesa.edu.ar
```

Do not commit the app password.

## Newsletter Commands

Preview the current deterministic issue:

```bash
pnpm newsletter:preview
```

Send a test email:

```bash
pnpm newsletter:send-test --to jkaplan@udesa.edu.ar
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
