import { jsonResponse } from "../utils/response";

export function handleHealth(): Response {
  return jsonResponse({ ok: true });
}
