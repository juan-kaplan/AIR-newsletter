import { loadConfig, type NewsletterConfig } from "../config";
import { renderEmail } from "../render/renderEmail";
import { createWorkerClient, type WorkerClient } from "../workerClient";
import { createSmtpSender, type EmailSender } from "./smtp";
import type { NewsletterIssue, SendSummary } from "../types";

export interface SendIssueOptions {
  confirm?: boolean;
  to?: string;
  config?: NewsletterConfig;
  workerClient?: WorkerClient;
  sender?: EmailSender;
}

export async function sendIssue(issue: NewsletterIssue, options: SendIssueOptions = {}): Promise<SendSummary> {
  const config = options.config ?? loadConfig();
  const dryRun = options.confirm !== true;

  if (!config.workerBaseUrl || !config.workerAdminToken) {
    if (dryRun) {
      return printAndReturn({
        issue: issue.slug,
        activeSubscribers: 0,
        sent: 0,
        skipped: 0,
        failed: 0,
        dryRun
      });
    }

    throw new Error("WORKER_BASE_URL and WORKER_ADMIN_TOKEN are required for confirmed sending.");
  }

  const workerClient = options.workerClient ?? createWorkerClient(config.workerBaseUrl, config.workerAdminToken);
  const subscribers = options.to
    ? [{ id: "test", email: options.to, emailHash: "test", unsubscribeUrl: `${config.workerBaseUrl}/unsubscribe?token=test` }]
    : await workerClient.fetchSubscribers();
  const disallowedSubscriber = subscribers.find(
    (subscriber) => !subscriber.email.toLowerCase().endsWith(`@${config.allowedRecipientDomain}`)
  );

  if (disallowedSubscriber) {
    throw new Error(`Recipient ${disallowedSubscriber.email} is outside @${config.allowedRecipientDomain}.`);
  }

  if (subscribers.length > config.maxRecipients) {
    throw new Error(`Active subscribers exceed MAX_RECIPIENTS=${config.maxRecipients}.`);
  }

  if (subscribers.length > config.maxEmailsPerRun) {
    throw new Error(`Planned sends exceed MAX_EMAILS_PER_RUN=${config.maxEmailsPerRun}.`);
  }

  if (!dryRun && (!config.smtpUser || !config.smtpPassword || !config.newsletterFrom)) {
    throw new Error("SMTP_USER, SMTP_PASSWORD, and NEWSLETTER_FROM are required for confirmed sending.");
  }

  const sender =
    options.sender ??
    (config.smtpUser && config.smtpPassword
      ? createSmtpSender({
          host: config.smtpHost,
          port: config.smtpPort,
          secure: config.smtpSecure,
          user: config.smtpUser,
          password: config.smtpPassword
        })
      : null);
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const rendered = await renderEmail(issue, subscriber.unsubscribeUrl);

    if (dryRun) {
      skipped += 1;
      await workerClient.recordDelivery({
        issueSlug: issue.slug,
        subscriberId: subscriber.id,
        subscriberEmail: subscriber.email,
        status: "skipped"
      });
      continue;
    }

    try {
      const delivery = await sender?.send({
        from: config.newsletterFrom ?? "",
        to: subscriber.email,
        subject: issue.subject,
        html: rendered.html,
        text: rendered.text,
        unsubscribeUrl: subscriber.unsubscribeUrl
      });

      sent += 1;
      await workerClient.recordDelivery({
        issueSlug: issue.slug,
        subscriberId: subscriber.id,
        subscriberEmail: subscriber.email,
        status: "sent",
        providerMessageId: delivery?.id
      });
    } catch (error) {
      failed += 1;
      await workerClient.recordDelivery({
        issueSlug: issue.slug,
        subscriberId: subscriber.id,
        subscriberEmail: subscriber.email,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown send failure"
      });
    }
  }

  return printAndReturn({
    issue: issue.slug,
    activeSubscribers: subscribers.length,
    sent,
    skipped,
    failed,
    dryRun
  });
}

function printAndReturn(summary: SendSummary): SendSummary {
  console.log(`Issue: ${summary.issue}`);
  console.log(`Active subscribers: ${summary.activeSubscribers}`);
  console.log(`Sent: ${summary.sent}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Failed: ${summary.failed}`);
  console.log(`Dry run: ${summary.dryRun}`);
  return summary;
}
