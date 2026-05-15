import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";

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

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

export function createSmtpSender(config: SmtpConfig): EmailSender {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password
    }
  });

  return {
    async send(message) {
      const result = await transporter.sendMail({
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        attachments: [
          {
            cid: AIR_LOGO_CID,
            filename: "air-logo.png",
            path: AIR_LOGO_PATH
          }
        ],
        headers: {
          "List-Unsubscribe": `<${message.unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }
      });

      return { id: result.messageId };
    }
  };
}

const AIR_LOGO_CID = "air-logo";
const AIR_LOGO_PATH = fileURLToPath(
  new URL("../../../email-templates/assets/air-logo.png", import.meta.url)
);
