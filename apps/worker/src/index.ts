import { handleAdmin } from "./routes/admin";
import { handleHealth } from "./routes/health";
import { handleHome, handleSubscribe } from "./routes/subscribe";
import { handleUnsubscribe, handleUnsubscribePage } from "./routes/unsubscribe";
import { jsonResponse, htmlResponse } from "./utils/response";
import type { Env } from "./db";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return handleHealth();
    }

    if (request.method === "GET" && url.pathname === "/") {
      return handleHome();
    }

    if (request.method === "POST" && url.pathname === "/subscribe") {
      return handleSubscribe(request, env);
    }

    if (request.method === "GET" && url.pathname === "/unsubscribe") {
      return handleUnsubscribePage(url);
    }

    if (request.method === "POST" && url.pathname === "/unsubscribe") {
      return handleUnsubscribe(request, env);
    }

    if (url.pathname.startsWith("/api/admin/")) {
      return handleAdmin(request, env, url);
    }

    if (request.headers.get("accept")?.includes("text/html")) {
      return htmlResponse("<h1>Not found</h1>", 404);
    }

    return jsonResponse({ ok: false, error: "Not found" }, 404);
  }
};
