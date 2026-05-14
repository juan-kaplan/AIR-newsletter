import { describe, expect, it } from "vitest";
import worker from "../src/index";
import { sha256Hex } from "../src/utils/crypto";
import { isValidEmail, normalizeEmail } from "../src/utils/validation";

interface SubscriberRow {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  unsubscribe_token_hash: string;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  source: string | null;
}

interface DeliveryRow {
  issue_slug: string;
  subscriber_id: string | null;
  subscriber_email_hash: string;
  status: "sent" | "skipped" | "failed";
}

class MemoryD1 {
  subscribers: SubscriberRow[] = [];
  deliveries: DeliveryRow[] = [];

  prepare(query: string) {
    return new MemoryStatement(this, query);
  }
}

class MemoryStatement {
  private values: unknown[] = [];

  constructor(
    private readonly db: MemoryD1,
    private readonly query: string
  ) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async first<T>() {
    if (this.query.startsWith("SELECT * FROM subscribers WHERE email")) {
      return (this.db.subscribers.find((subscriber) => subscriber.email === this.values[0]) ?? null) as T | null;
    }

    return null;
  }

  async all<T>() {
    if (this.query.startsWith("SELECT * FROM subscribers WHERE status")) {
      return {
        results: this.db.subscribers.filter((subscriber) => subscriber.status === "active") as T[]
      };
    }

    return { results: [] as T[] };
  }

  async run() {
    if (this.query.includes("INSERT INTO subscribers")) {
      this.db.subscribers = [
        ...this.db.subscribers,
        {
          id: this.values[0] as string,
          email: this.values[1] as string,
          status: "active",
          unsubscribe_token_hash: this.values[2] as string,
          created_at: this.values[3] as string,
          confirmed_at: this.values[4] as string,
          unsubscribed_at: null,
          source: "web"
        }
      ];
      return { meta: { changes: 1 } };
    }

    if (this.query.includes("UPDATE subscribers") && this.query.includes("WHERE email")) {
      const email = this.values[2] as string;
      this.db.subscribers = this.db.subscribers.map((subscriber) =>
        subscriber.email === email
          ? {
              ...subscriber,
              status: "active",
              unsubscribe_token_hash: this.values[0] as string,
              confirmed_at: this.values[1] as string,
              unsubscribed_at: null
            }
          : subscriber
      );
      return { meta: { changes: 1 } };
    }

    if (this.query.includes("unsubscribed_at = ? WHERE unsubscribe_token_hash")) {
      const tokenHash = this.values[1] as string;
      let changes = 0;
      this.db.subscribers = this.db.subscribers.map((subscriber) => {
        if (subscriber.unsubscribe_token_hash !== tokenHash) {
          return subscriber;
        }

        changes += 1;
        return { ...subscriber, status: "unsubscribed", unsubscribed_at: this.values[0] as string };
      });
      return { meta: { changes } };
    }

    if (this.query.includes("INSERT INTO deliveries")) {
      this.db.deliveries = [
        ...this.db.deliveries,
        {
          issue_slug: this.values[1] as string,
          subscriber_id: this.values[2] as string | null,
          subscriber_email_hash: this.values[3] as string,
          status: this.values[4] as "sent" | "skipped" | "failed"
        }
      ];
      return { meta: { changes: 1 } };
    }

    return { meta: { changes: 0 } };
  }
}

function createEnv(db = new MemoryD1()) {
  return {
    DB: db as unknown as D1Database,
    WORKER_ADMIN_TOKEN: "admin-token"
  };
}

describe("worker utilities", () => {
  it("normalizes emails and rejects invalid addresses", () => {
    expect(normalizeEmail("  Person@UDESA.EDU.AR ")).toBe("person@udesa.edu.ar");
    expect(isValidEmail("person@udesa.edu.ar")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("hashes unsubscribe tokens with SHA-256", async () => {
    const hash = await sha256Hex("token");
    expect(hash).toHaveLength(64);
    expect(hash).not.toBe("token");
  });
});

describe("worker routes", () => {
  it("subscribes idempotently without leaking existing status", async () => {
    const db = new MemoryD1();
    const env = createEnv(db);
    const createRequest = () =>
      new Request("https://worker.test/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: " Person@UDESA.EDU.AR " })
      });

    const first = await worker.fetch(createRequest(), env);
    const second = await worker.fetch(createRequest(), env);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(db.subscribers).toHaveLength(1);
    expect(db.subscribers[0]?.email).toBe("person@udesa.edu.ar");
  });

  it("rejects invalid and external subscribe emails", async () => {
    const response = await worker.fetch(
      new Request("https://worker.test/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "bad" })
      }),
      createEnv()
    );

    expect(response.status).toBe(400);

    const externalResponse = await worker.fetch(
      new Request("https://worker.test/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "person@example.com" })
      }),
      createEnv()
    );

    expect(externalResponse.status).toBe(400);
  });

  it("returns 401 for admin routes without a valid bearer token", async () => {
    const response = await worker.fetch(new Request("https://worker.test/api/admin/subscribers"), createEnv());
    expect(response.status).toBe(401);
  });

  it("returns active subscribers with raw unsubscribe URLs while storing only token hashes", async () => {
    const db = new MemoryD1();
    const env = createEnv(db);
    await worker.fetch(
      new Request("https://worker.test/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "person@udesa.edu.ar" })
      }),
      env
    );

    const response = await worker.fetch(
      new Request("https://worker.test/api/admin/subscribers", {
        headers: { authorization: "Bearer admin-token" }
      }),
      env
    );
    const body = (await response.json()) as { subscribers: Array<{ unsubscribeUrl: string }> };
    const token = new URL(body.subscribers[0]?.unsubscribeUrl ?? "").searchParams.get("token") ?? "";

    expect(response.status).toBe(200);
    expect(token).toHaveLength(64);
    expect(db.subscribers[0]?.unsubscribe_token_hash).not.toBe(token);
  });

  it("rejects invalid unsubscribe tokens", async () => {
    const response = await worker.fetch(
      new Request("https://worker.test/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: "invalid" })
      }),
      createEnv()
    );

    expect(response.status).toBe(400);
  });

  it("records delivery payloads without storing raw emails", async () => {
    const db = new MemoryD1();
    const response = await worker.fetch(
      new Request("https://worker.test/api/admin/deliveries", {
        method: "POST",
        headers: {
          authorization: "Bearer admin-token",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          issueSlug: "weekly",
          subscriberId: "sub_1",
          subscriberEmail: "person@udesa.edu.ar",
          status: "sent",
          providerMessageId: "msg_1"
        })
      }),
      createEnv(db)
    );

    expect(response.status).toBe(200);
    expect(db.deliveries[0]).toMatchObject({
      issue_slug: "weekly",
      subscriber_id: "sub_1",
      status: "sent"
    });
    expect(db.deliveries[0]?.subscriber_email_hash).toHaveLength(64);
  });
});
