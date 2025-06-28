import { CookieKeys } from "app/lib/cookies";
import {
  deleteServerCookie,
  getServerCookie,
  setServerCookie,
} from "app/lib/server-cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") as CookieKeys;

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  try {
    const value = await getServerCookie(key);
    return NextResponse.json({ value });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get cookie" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, options } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    await setServerCookie(key as CookieKeys, value, options);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") as CookieKeys;

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  try {
    await deleteServerCookie(key);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cookie" },
      { status: 500 }
    );
  }
}
