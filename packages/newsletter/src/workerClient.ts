import type { DeliveryLog, Subscriber } from "./types";

export interface WorkerClient {
  fetchSubscribers(): Promise<Subscriber[]>;
  recordDelivery(payload: DeliveryLog): Promise<void>;
}

export function createWorkerClient(baseUrl: string, adminToken: string): WorkerClient {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const authorization = `Bearer ${adminToken}`;

  return {
    async fetchSubscribers() {
      const response = await fetch(`${normalizedBaseUrl}/api/admin/subscribers`, {
        headers: { authorization }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscribers: HTTP ${response.status}`);
      }

      const body = (await response.json()) as { subscribers?: Subscriber[] };
      return body.subscribers ?? [];
    },
    async recordDelivery(payload) {
      const response = await fetch(`${normalizedBaseUrl}/api/admin/deliveries`, {
        method: "POST",
        headers: {
          authorization,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to record delivery: HTTP ${response.status}`);
      }
    }
  };
}
