export interface NewsletterArticle {
  title: string;
  url: string;
  summary: string;
}

export interface NewsletterIssue {
  slug: string;
  subject: string;
  preheader: string;
  articles: NewsletterArticle[];
}

export interface Subscriber {
  id: string;
  email: string;
  emailHash: string;
  unsubscribeUrl: string;
}

export interface DeliveryLog {
  issueSlug: string;
  subscriberId?: string;
  subscriberEmail: string;
  status: "sent" | "skipped" | "failed";
  providerMessageId?: string;
  error?: string;
}

export interface SendSummary {
  issue: string;
  activeSubscribers: number;
  sent: number;
  skipped: number;
  failed: number;
  dryRun: boolean;
}
