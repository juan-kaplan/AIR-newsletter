export interface NewsletterArticle {
  title: string;
  url: string;
  summary: string;
  source?: string;
  publishedAt?: string;
  imageUrl?: string;
  category?: "competition" | "research" | "industry" | "tooling" | "event";
  score?: number;
  selectionReason?: string;
}

export interface NewsletterIssue {
  slug: string;
  subject: string;
  preheader: string;
  intro?: string;
  articles: NewsletterArticle[];
  generatedFromWeeks?: string[];
}
