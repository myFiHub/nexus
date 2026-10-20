import { CookieKeys } from "app/lib/client-cookies";
import { deleteServerCookie, setServerCookie } from "app/lib/server-cookies";
import { isUserKey, isUuid, rejectUntrusted } from "app/lib/server/requestGuards";
import { NextRequest, NextResponse } from "next/server";

/** Only the session hints the server reads for redirects; never the auth token. */
const WRITABLE: Partial<Record<CookieKeys, (value: string) => boolean>> = {
  [CookieKeys.myUserId]: isUuid,
  [CookieKeys.myMoveAddress]: isUserKey,
};

const writableKey = (key: unknown): key is CookieKeys =>
  typeof key === "string" && key in WRITABLE;

export async function POST(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  try {
    const { key, value } = await request.json();
    if (!writableKey(key) || typeof value !== "string" || !WRITABLE[key]!(value)) {
      return NextResponse.json({ error: "Invalid cookie" }, { status: 400 });
    }
    await setServerCookie(key, value, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  const key = new URL(request.url).searchParams.get("key");
  if (!writableKey(key)) {
    return NextResponse.json({ error: "Invalid cookie" }, { status: 400 });
  }
  try {
    await deleteServerCookie(key);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete cookie" }, { status: 500 });
  }
}
