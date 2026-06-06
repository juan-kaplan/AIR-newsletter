#!/usr/bin/env node
import { buildIssue } from "./compose/buildIssue";
import { collectAndStoreWeeklyDigest, verifyCollectionSources } from "./collect";
import { renderEmail } from "./render/renderEmail";
import { sendIssue } from "./send/sendIssue";

const [, , command, ...args] = process.argv;

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
    const rendered = await renderEmail(issue, "https://example.com/unsubscribe?token=preview");
    console.log(rendered.text);
    return;
  }

  if (command === "send-test") {
    const to = getArgValue(args, "--to");
    if (!to) {
      throw new Error("Use --to someone@example.com for test sends.");
    }

    await sendIssue(await buildIssue(), { confirm: isConfirmed(args), to });
    return;
  }

  if (command === "send") {
    await sendIssue(await buildIssue(), { confirm: isConfirmed(args) });
    return;
  }

  throw new Error(`Unknown command: ${command ?? "(missing)"}`);
}

function getArgValue(argsToSearch: string[], flag: string): string | null {
  const index = argsToSearch.indexOf(flag);
  return index >= 0 ? argsToSearch[index + 1] ?? null : null;
}

function isConfirmed(argsToSearch: string[]): boolean {
  return argsToSearch.includes("--confirm") && !argsToSearch.includes("--dry-run");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
