import { listActiveSubscribers, recordDelivery, type DeliveryPayload, type Env } from "../db";
import { deriveUnsubscribeToken, sha256Hex } from "../utils/crypto";
import { jsonResponse } from "../utils/response";
import { isValidEmail, normalizeEmail, readJsonObject } from "../utils/validation";

export async function handleAdmin(request: Request, env: Env, url: URL): Promise<Response> {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  if (request.method === "GET" && url.pathname === "/api/admin/subscribers") {
    return handleListSubscribers(request, env);
  }

  if (request.method === "POST" && url.pathname === "/api/admin/deliveries") {
    return handleRecordDelivery(request, env);
  }

  return jsonResponse({ ok: false, error: "Not found" }, 404);
}

function isAuthorized(request: Request, env: Env): boolean {
  const configuredToken = env.WORKER_ADMIN_TOKEN;
  const authorization = request.headers.get("authorization") ?? "";

  if (!configuredToken || !authorization.startsWith("Bearer ")) {
    return false;
  }

  return authorization.slice("Bearer ".length) === configuredToken;
}

async function handleListSubscribers(request: Request, env: Env): Promise<Response> {
  const subscribers = await listActiveSubscribers(env.DB);
  const baseUrl = new URL(request.url).origin;
  const body = await Promise.all(
    subscribers.map(async (subscriber) => {
      const token = await deriveUnsubscribeToken(
        subscriber.email,
        subscriber.confirmed_at ?? subscriber.created_at,
        env.WORKER_ADMIN_TOKEN ?? ""
      );
      return {
        id: subscriber.id,
        email: subscriber.email,
        emailHash: await sha256Hex(subscriber.email),
        unsubscribeUrl: `${baseUrl}/unsubscribe?token=${token}`
      };
    })
  );

  return jsonResponse({ ok: true, subscribers: body });
}

async function handleRecordDelivery(request: Request, env: Env): Promise<Response> {
  const body = await readJsonObject(request);
  const payload = parseDeliveryPayload(body);

  if (!payload) {
    return jsonResponse({ ok: false, error: "Invalid delivery payload." }, 400);
  }

  await recordDelivery(env.DB, payload, new Date().toISOString());
  return jsonResponse({ ok: true });
}

function parseDeliveryPayload(body: Record<string, unknown> | null): DeliveryPayload | null {
  if (!body) {
    return null;
  }

  const issueSlug = body.issueSlug;
  const subscriberId = body.subscriberId;
  const subscriberEmail = body.subscriberEmail;
  const status = body.status;
  const providerMessageId = body.providerMessageId;
  const error = body.error;

  if (typeof issueSlug !== "string" || issueSlug.length === 0) {
    return null;
  }

  if (typeof subscriberEmail !== "string" || !isValidEmail(normalizeEmail(subscriberEmail))) {
    return null;
  }

  if (status !== "sent" && status !== "skipped" && status !== "failed") {
    return null;
  }

  return {
    issueSlug,
    subscriberEmail: normalizeEmail(subscriberEmail),
    status,
    ...(typeof subscriberId === "string" ? { subscriberId } : {}),
    ...(typeof providerMessageId === "string" ? { providerMessageId } : {}),
    ...(typeof error === "string" ? { error } : {})
  };
}
