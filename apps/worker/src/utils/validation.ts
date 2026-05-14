const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedEmailDomain = "udesa.edu.ar";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && emailPattern.test(email);
}

export function isAllowedSubscriberEmail(email: string): boolean {
  return isValidEmail(email) && email.endsWith(`@${allowedEmailDomain}`);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}
