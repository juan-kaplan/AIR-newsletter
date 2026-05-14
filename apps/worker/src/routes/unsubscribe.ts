import { unsubscribeByToken, type Env } from "../db";
import { htmlResponse, jsonResponse } from "../utils/response";
import { readJsonObject } from "../utils/validation";

export function handleUnsubscribePage(url: URL): Response {
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return htmlResponse("<h1>Invalid unsubscribe link</h1><p>This link is missing a token.</p>", 400);
  }

  const safeToken = token.replaceAll('"', "&quot;");
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Unsubscribe</title></head>
  <body style="font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 38rem; padding: 0 1rem;">
    <h1>Unsubscribe</h1>
    <p>Confirm that you want to stop receiving this newsletter.</p>
    <form method="post" action="/unsubscribe">
      <input type="hidden" name="token" value="${safeToken}">
      <button type="submit">Unsubscribe</button>
    </form>
  </body>
</html>`);
}

export async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  const token = await getTokenFromRequest(request);

  if (!token) {
    return jsonResponse({ ok: false, error: "Invalid unsubscribe token." }, 400);
  }

  const didUnsubscribe = await unsubscribeByToken(env.DB, token, new Date().toISOString());

  if (!didUnsubscribe) {
    return jsonResponse({ ok: false, error: "Invalid unsubscribe token." }, 400);
  }

  return jsonResponse({ ok: true, message: "You have been unsubscribed." });
}

async function getTokenFromRequest(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await readJsonObject(request);
    return typeof body?.token === "string" && body.token.length > 0 ? body.token : null;
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const token = form.get("token");
    return typeof token === "string" && token.length > 0 ? token : null;
  }

  return null;
}
