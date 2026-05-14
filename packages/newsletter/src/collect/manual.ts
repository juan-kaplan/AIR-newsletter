import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { NewsletterArticle } from "../types";

export async function collectManualArticles(directory = "content/manual"): Promise<NewsletterArticle[]> {
  try {
    const files = await readdir(directory);
    const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();
    const articles = await Promise.all(
      markdownFiles.map(async (file) => parseMarkdownArticle(join(directory, file)))
    );
    return articles.filter((article): article is NewsletterArticle => Boolean(article));
  } catch {
    return [];
  }
}

async function parseMarkdownArticle(path: string): Promise<NewsletterArticle | null> {
  const content = await readFile(path, "utf8");
  const title = matchField(content, "title");
  const url = matchField(content, "url");
  const summary = matchField(content, "summary");
  const source = matchField(content, "source");
  const publishedAt = matchField(content, "publishedAt");

  if (!title || !url || !summary) {
    return null;
  }

  return {
    title,
    url,
    summary,
    ...(source ? { source } : {}),
    ...(publishedAt ? { publishedAt } : {})
  };
}

function matchField(content: string, field: string): string | null {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() ?? null;
}
