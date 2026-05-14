import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import YAML from "yaml";

export interface MarkdownSource {
  key: string;
  type: "markdown";
  path: string;
}

export interface RssSource {
  key: string;
  name: string;
  type: "rss";
  url: string;
  maxItems?: number;
  category?: "competition" | "research" | "industry" | "tooling" | "event";
  priority?: number;
}

export interface CompetitionPageSource {
  key: string;
  name: string;
  type: "competition_page";
  url: string;
  maxItems?: number;
}

export type NewsletterSource = MarkdownSource | RssSource | CompetitionPageSource;

interface SourcesFile {
  sources?: NewsletterSource[];
}

export async function loadSources(path = join(findProjectRoot(), "content/sources.yaml")): Promise<NewsletterSource[]> {
  const raw = await readFile(path, "utf8");
  const parsed = YAML.parse(raw) as SourcesFile;
  return parsed.sources ?? [];
}

export function resolveProjectPath(path: string): string {
  return join(findProjectRoot(), path);
}

function findProjectRoot(start = process.cwd()): string {
  let current = start;

  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }

    current = dirname(current);
  }

  return start;
}
