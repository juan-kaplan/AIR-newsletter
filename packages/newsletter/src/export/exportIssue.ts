import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildIssue } from "../compose/buildIssue";
import { renderEmail } from "../render/renderEmail";

export async function exportIssue(outDir = "dist"): Promise<void> {
  const issue = await buildIssue();
  const rendered = await renderEmail(issue);

  await mkdir(outDir, { recursive: true });

  const htmlPath = join(outDir, "newsletter.html");
  const textPath = join(outDir, "newsletter.txt");

  await Promise.all([
    writeFile(htmlPath, rendered.html, "utf8"),
    writeFile(textPath, rendered.text, "utf8"),
  ]);

  console.log(`Exported: ${htmlPath}`);
  console.log(`Exported: ${textPath}`);
  console.log(`Subject:  ${issue.subject}`);
  console.log(`Articles: ${issue.articles.length}`);
}
