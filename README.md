# Automatic Newsletter

Automatic Newsletter is a repo-first internal UdeSA newsletter system. The current workflow collects robotics links weekly, curates a monthly issue, and sends it only to `jfigueiredopaschmann@udesa.edu.ar`.

## Architecture

- GitHub repo stores source, content, tests, and workflows.
- GitHub Actions runs CI, weekly collection, and the scheduled monthly self-send.
- RSS and competition-page collection pull robotics links from `content/sources.yaml`.
- Weekly curated digests are stored in `content/curated/weekly/`; the monthly issue selects up to 10 items from those weekly files.
- Cloudflare Worker exposes subscribe, unsubscribe, health, and admin endpoints.
- Cloudflare D1 stores subscribers, issues, delivery records, and audit events.
- Gmail SMTP sends the issue from `jfigueiredopaschmann@udesa.edu.ar` to `jfigueiredopaschmann@udesa.edu.ar`.
- React Email renders the HTML email and a plain text companion.

No custom domain, Resend, Supabase, Postgres, Prisma, Vercel, Next.js, Stripe, SES, Listmonk, paid hosting, or full admin dashboard is included.

## Free-Tier Assumptions

This project currently sends one email per run, to yourself. The old list limits remain as safeguards if the subscriber workflow is used later:

- `MAX_RECIPIENTS=30`
- `MAX_EMAILS_PER_RUN=35`
- `ALLOWED_RECIPIENT_DOMAIN=udesa.edu.ar`

The Worker rejects non-`@udesa.edu.ar` subscribers. The sender refuses to run if any recipient is outside `@udesa.edu.ar`.

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
GEMINI_API_KEY
```

`GEMINI_API_KEY` is optional. If it is missing, the newsletter still uses the deterministic club-specific ranking rules.

The workflow sets these non-secret values directly:

```txt
NEWSLETTER_FROM=jfigueiredopaschmann@udesa.edu.ar
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
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
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=jfigueiredopaschmann@udesa.edu.ar
NEWSLETTER_FROM=jfigueiredopaschmann@udesa.edu.ar
```

Do not commit the app password.

## Newsletter Commands

Verify live RSS sources:

```bash
pnpm newsletter:verify-sources
```

Collect and store this week's curated digest:

```bash
pnpm newsletter:collect
```

Preview the current generated issue:

```bash
pnpm newsletter:preview
```

Send the newsletter to yourself:

```bash
pnpm newsletter:send-test --to jfigueiredopaschmann@udesa.edu.ar
```

Dry run to yourself:

```bash
pnpm newsletter:send-test --to jfigueiredopaschmann@udesa.edu.ar --dry-run
```

Production send to yourself:

```bash
pnpm newsletter:send-test --to jfigueiredopaschmann@udesa.edu.ar --confirm
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

The weekly collection workflow runs on Monday at `09:30 America/Argentina/Buenos_Aires`, writes up to 6 selected items to `content/curated/weekly/`, and commits that weekly digest.

The monthly send workflow runs on the first day of each month at `10:17 America/Argentina/Buenos_Aires` and can also be triggered manually. It targets only `jfigueiredopaschmann@udesa.edu.ar`. Use the manual `dry_run` input for safe checks.

## Unsubscribe

The Worker generates a random unsubscribe token, stores only its SHA-256 hash in D1, and returns unsubscribe URLs only through the admin subscriber endpoint. Each sent email includes both `List-Unsubscribe` and `List-Unsubscribe-Post` headers. A raw token is never stored in D1.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm newsletter:verify-sources
pnpm newsletter:collect
pnpm newsletter:preview
pnpm newsletter:send-test --to jfigueiredopaschmann@udesa.edu.ar --dry-run
```
