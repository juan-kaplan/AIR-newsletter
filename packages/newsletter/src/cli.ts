#!/usr/bin/env node
import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

// Walk up from cwd to find the nearest .env (handles pnpm workspace CWD shifts)
function findEnvFile(): string | undefined {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, ".env");
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}
const envFile = findEnvFile();
if (envFile) loadEnv({ path: envFile });

import { buildIssue } from "./compose/buildIssue";
import { collectAndStoreWeeklyDigest, verifyCollectionSources } from "./collect";
import { exportIssue } from "./export/exportIssue";
import { renderEmail } from "./render/renderEmail";

const [, , command] = process.argv;

async function main(): Promise<void> {
  if (command === "collect") {
    const result = await collectAndStoreWeeklyDigest();
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "draft") {
    const issue = await buildIssue();
    console.log(JSON.stringify(issue, null, 2));
    return;
  }

  if (command === "verify-sources") {
    const results = await verifyCollectionSources();
    console.table(results);
    if (results.some((result) => !result.ok)) {
      process.exitCode = 1;
    }
    return;
  }

  if (command === "preview") {
    const issue = await buildIssue();
    const rendered = await renderEmail(issue);
    console.log(rendered.text);
    return;
  }

  if (command === "export") {
    await exportIssue();
    return;
  }

  throw new Error(`Unknown command: ${command ?? "(missing)"}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
