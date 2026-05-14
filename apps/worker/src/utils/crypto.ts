export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function deriveUnsubscribeToken(email: string, confirmedAt: string, secret: string): Promise<string> {
  return sha256Hex(`${secret}:unsubscribe:v1:${email}:${confirmedAt}`);
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
