export interface NewsletterConfig {
  resendApiKey?: string;
  newsletterFrom?: string;
  workerBaseUrl?: string;
  workerAdminToken?: string;
  maxRecipients: number;
  maxEmailsPerRun: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): NewsletterConfig {
  return {
    resendApiKey: env.RESEND_API_KEY,
    newsletterFrom: env.NEWSLETTER_FROM,
    workerBaseUrl: env.WORKER_BASE_URL,
    workerAdminToken: env.WORKER_ADMIN_TOKEN,
    maxRecipients: parseLimit(env.MAX_RECIPIENTS, 30),
    maxEmailsPerRun: parseLimit(env.MAX_EMAILS_PER_RUN, 35)
  };
}

function parseLimit(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
