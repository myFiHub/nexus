import { rejectUntrusted } from "app/lib/server/requestGuards";
import { isDev } from "app/lib/utils";
import { lumaApiKey, lumaFetch, verifyPodiumUser } from "app/services/api/luma/server";
import { NextRequest, NextResponse } from "next/server";

type Method = "GET" | "POST";

/** The only Luma endpoints the app uses. Writes need a signed-in Podium user. */
const ALLOWED: Record<string, { method: Method; auth: boolean }> = {
  "/public/v1/event/get": { method: "GET", auth: false },
  "/public/v1/event/create": { method: "POST", auth: true },
  "/public/v1/event/add-host": { method: "POST", auth: true },
  "/public/v1/event/add-guests": { method: "POST", auth: true },
  "/public/v1/event/send-invite": { method: "POST", auth: true },
};

const MAX_BODY_BYTES = 64 * 1024;

/** Host emails are private; the browser only needs names and avatars. */
const redactEvent = (data: unknown) => {
  if (data && typeof data === "object" && Array.isArray((data as { hosts?: unknown }).hosts)) {
    const event = data as { hosts: Record<string, unknown>[] };
    return { ...event, hosts: event.hosts.map(({ email: _email, ...host }) => host) };
  }
  return data;
};

async function handle(request: NextRequest, method: Method, segments: string[]) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;

  const path = "/" + segments.join("/");
  const rule = ALLOWED[path];
  if (!rule || rule.method !== method) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!lumaApiKey()) {
    return NextResponse.json({ error: "Luma is not configured" }, { status: 503 });
  }
  if (rule.auth && !(await verifyPodiumUser(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: string | undefined;
  if (method === "POST") {
    body = await request.text();
    if (body.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
  }

  try {
    const search = new URL(request.url).search;
    const response = await lumaFetch(`${path}${search}`, { method, body, cache: "no-store" });
    const text = await response.text();
    let data: unknown = text;
    try {
      data = JSON.parse(text);
    } catch {}
    if (path === "/public/v1/event/get") data = redactEvent(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (isDev) console.error("Luma proxy error:", error);
    return NextResponse.json({ error: "Luma is unavailable" }, { status: 502 });
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  return handle(request, "GET", (await params).path);
}

export async function POST(request: NextRequest, { params }: Ctx) {
  return handle(request, "POST", (await params).path);
}
