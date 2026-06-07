export interface NewsletterConfig {
  aiProvider: string;
  geminiApiKey?: string;
  nvidiaApiKey?: string;
  nvidiaModel: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): NewsletterConfig {
  return {
    aiProvider: env.NEWSLETTER_AI_PROVIDER ?? "none",
    geminiApiKey: env.GEMINI_API_KEY,
    nvidiaApiKey: env.NVIDIA_API_KEY,
    nvidiaModel: env.NVIDIA_MODEL ?? "meta/llama-3.1-70b-instruct",
  };
}
