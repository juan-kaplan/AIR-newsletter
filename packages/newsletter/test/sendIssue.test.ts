import { describe, expect, it, vi } from "vitest";
import { sendIssue } from "../src/send/sendIssue";
import type { NewsletterConfig } from "../src/config";
import type { DeliveryLog, NewsletterIssue, Subscriber } from "../src/types";

const issue: NewsletterIssue = {
  slug: "weekly",
  subject: "Weekly issue",
  preheader: "A compact update.",
  articles: [
    {
      title: "Useful link",
      url: "https://example.com/useful",
      summary: "A useful thing to read."
    }
  ]
};

const subscriber: Subscriber = {
  id: "sub_1",
  email: "person@udesa.edu.ar",
  emailHash: "hash",
  unsubscribeUrl: "https://worker.test/unsubscribe?token=abc"
};

describe("sendIssue", () => {
  it("defaults to dry-run and logs skipped deliveries", async () => {
    const deliveries: DeliveryLog[] = [];
    const send = vi.fn();

    const summary = await sendIssue(issue, {
      config: config(),
      workerClient: {
        async fetchSubscribers() {
          return [subscriber];
        },
        async recordDelivery(payload) {
          deliveries.push(payload);
        }
      },
      sender: { send }
    });

    expect(summary.dryRun).toBe(true);
    expect(summary.skipped).toBe(1);
    expect(send).not.toHaveBeenCalled();
    expect(deliveries[0]).toMatchObject({
      issueSlug: "weekly",
      subscriberEmail: "person@udesa.edu.ar",
      status: "skipped"
    });
  });

  it("refuses more than MAX_RECIPIENTS", async () => {
    await expect(
      sendIssue(issue, {
        config: config({ maxRecipients: 1 }),
        workerClient: {
          async fetchSubscribers() {
            return [subscriber, { ...subscriber, id: "sub_2", email: "two@udesa.edu.ar" }];
          },
          async recordDelivery() {
            return undefined;
          }
        }
      })
    ).rejects.toThrow("MAX_RECIPIENTS=1");
  });

  it("continues sending and records failed deliveries", async () => {
    const deliveries: DeliveryLog[] = [];

    await expect(
      sendIssue(issue, {
        confirm: true,
        config: config(),
        workerClient: {
          async fetchSubscribers() {
            return [subscriber];
          },
          async recordDelivery(payload) {
            deliveries.push(payload);
          }
        },
        sender: {
          async send() {
            throw new Error("provider down");
          }
        }
      })
    ).rejects.toThrow("Newsletter send failed for 1 recipient");

    expect(deliveries[0]).toMatchObject({
      issueSlug: "weekly",
      subscriberEmail: "person@udesa.edu.ar",
      status: "failed",
      error: "provider down"
    });
  });

  it("refuses recipients outside the allowed domain", async () => {
    await expect(
      sendIssue(issue, {
        config: config(),
        workerClient: {
          async fetchSubscribers() {
            return [{ ...subscriber, email: "person@example.com" }];
          },
          async recordDelivery() {
            return undefined;
          }
        }
      })
    ).rejects.toThrow("outside @udesa.edu.ar");
  });
});

function config(overrides: Partial<NewsletterConfig> = {}): NewsletterConfig {
  return {
    newsletterFrom: "jfigueiredopaschmann@udesa.edu.ar",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "jfigueiredopaschmann@udesa.edu.ar",
    smtpPassword: "app-password-placeholder",
    allowedRecipientDomain: "udesa.edu.ar",
    workerBaseUrl: "https://worker.test",
    workerAdminToken: "admin-token",
    maxRecipients: 30,
    maxEmailsPerRun: 35,
    ...overrides
  };
}
