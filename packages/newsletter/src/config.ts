export interface NewsletterConfig {
  newsletterFrom?: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser?: string;
  smtpPassword?: string;
  allowedRecipientDomain: string;
  workerBaseUrl?: string;
  workerAdminToken?: string;
  maxRecipients: number;
  maxEmailsPerRun: number;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): NewsletterConfig {
  return {
    newsletterFrom: env.NEWSLETTER_FROM,
    smtpHost: env.SMTP_HOST ?? "smtp.gmail.com",
    smtpPort: parseLimit(env.SMTP_PORT, 587),
    smtpSecure: env.SMTP_SECURE === "true",
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD,
    allowedRecipientDomain: env.ALLOWED_RECIPIENT_DOMAIN ?? "udesa.edu.ar",
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
