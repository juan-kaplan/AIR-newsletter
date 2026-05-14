import { createId, sha256Hex } from "./utils/crypto";

export interface Env {
  DB: D1Database;
  WORKER_ADMIN_TOKEN?: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  unsubscribe_token_hash: string;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  source: string | null;
}

export interface DeliveryPayload {
  issueSlug: string;
  subscriberId?: string;
  subscriberEmail: string;
  status: "sent" | "skipped" | "failed";
  providerMessageId?: string;
  error?: string;
}

export async function findSubscriberByEmail(db: D1Database, email: string): Promise<SubscriberRecord | null> {
  return await db.prepare("SELECT * FROM subscribers WHERE email = ? LIMIT 1").bind(email).first<SubscriberRecord>();
}

export async function upsertActiveSubscriber(
  db: D1Database,
  email: string,
  unsubscribeTokenHash: string,
  now: string
): Promise<void> {
  const existing = await findSubscriberByEmail(db, email);

  if (!existing) {
    await db
      .prepare(
        `INSERT INTO subscribers (
          id, email, status, unsubscribe_token_hash, created_at, confirmed_at, unsubscribed_at, source
        ) VALUES (?, ?, 'active', ?, ?, ?, NULL, 'web')`
      )
      .bind(createId("sub"), email, unsubscribeTokenHash, now, now)
      .run();
    return;
  }

  await db
    .prepare(
      `UPDATE subscribers
       SET status = 'active',
           unsubscribe_token_hash = ?,
           confirmed_at = ?,
           unsubscribed_at = NULL
       WHERE email = ?`
    )
    .bind(unsubscribeTokenHash, now, email)
    .run();
}

export async function unsubscribeByToken(db: D1Database, token: string, now: string): Promise<boolean> {
  const tokenHash = await sha256Hex(token);
  const result = await db
    .prepare("UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = ? WHERE unsubscribe_token_hash = ?")
    .bind(now, tokenHash)
    .run();

  return result.meta.changes > 0;
}

export async function listActiveSubscribers(db: D1Database): Promise<SubscriberRecord[]> {
  const result = await db
    .prepare("SELECT * FROM subscribers WHERE status = 'active' ORDER BY created_at ASC")
    .all<SubscriberRecord>();
  return result.results ?? [];
}

export async function recordDelivery(db: D1Database, payload: DeliveryPayload, now: string): Promise<void> {
  const emailHash = await sha256Hex(payload.subscriberEmail);
  await db
    .prepare(
      `INSERT INTO deliveries (
        id, issue_slug, subscriber_id, subscriber_email_hash, status, provider_message_id, error, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId("del"),
      payload.issueSlug,
      payload.subscriberId ?? null,
      emailHash,
      payload.status,
      payload.providerMessageId ?? null,
      payload.error ?? null,
      now
    )
    .run();
}
