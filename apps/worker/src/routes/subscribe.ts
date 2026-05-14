import { upsertActiveSubscriber, type Env } from "../db";
import { deriveUnsubscribeToken, sha256Hex } from "../utils/crypto";
import { htmlResponse, jsonResponse } from "../utils/response";
import { isValidEmail, normalizeEmail, readJsonObject } from "../utils/validation";

export function handleHome(): Response {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Automatic Newsletter</title>
    <style>
      body { color: #1f2937; font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 42rem; padding: 0 1rem; }
      form { display: flex; gap: .5rem; margin-top: 1.5rem; }
      input { border: 1px solid #9ca3af; border-radius: .375rem; flex: 1; font: inherit; padding: .75rem; }
      button { background: #111827; border: 0; border-radius: .375rem; color: white; font: inherit; padding: .75rem 1rem; }
    </style>
  </head>
  <body>
    <h1>Automatic Newsletter</h1>
    <p>A small weekly note delivered by email.</p>
    <form method="post" action="/subscribe">
      <input aria-label="Email" name="email" type="email" autocomplete="email" required>
      <button type="submit">Subscribe</button>
    </form>
  </body>
</html>`);
}

export async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  const email = await getEmailFromRequest(request);

  if (!email || !isValidEmail(email)) {
    return jsonResponse({ ok: false, error: "Enter a valid email address." }, 400);
  }

  if (!env.WORKER_ADMIN_TOKEN) {
    return jsonResponse({ ok: false, error: "Newsletter is not configured." }, 503);
  }

  const now = new Date().toISOString();
  const token = await deriveUnsubscribeToken(email, now, env.WORKER_ADMIN_TOKEN);
  const tokenHash = await sha256Hex(token);
  await upsertActiveSubscriber(env.DB, email, tokenHash, now);

  return jsonResponse({
    ok: true,
    message: "If this address can be subscribed, it will receive the newsletter."
  });
}

async function getEmailFromRequest(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await readJsonObject(request);
    const email = body?.email;
    return typeof email === "string" ? normalizeEmail(email) : null;
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const email = form.get("email");
    return typeof email === "string" ? normalizeEmail(email) : null;
  }

  return null;
}
