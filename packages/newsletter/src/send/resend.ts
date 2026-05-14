import { Resend } from "resend";

export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<{ id: string }>;
}

export function createResendSender(apiKey: string): EmailSender {
  const resend = new Resend(apiKey);

  return {
    async send(message) {
      const result = await resend.emails.send({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        headers: {
          "List-Unsubscribe": `<${message.unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { id: result.data?.id ?? "unknown" };
    }
  };
}
