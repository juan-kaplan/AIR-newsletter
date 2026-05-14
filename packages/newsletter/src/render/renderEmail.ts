import { render } from "@react-email/render";
import { WeeklyNewsletter } from "@newsletter/email-templates";
import type { NewsletterIssue } from "../types";

export async function renderEmail(issue: NewsletterIssue, unsubscribeUrl: string): Promise<{ html: string; text: string }> {
  const element = WeeklyNewsletter({ issue, unsubscribeUrl });
  const [html, text] = await Promise.all([
    render(element, { pretty: true }),
    render(element, { plainText: true })
  ]);

  return { html, text };
}
