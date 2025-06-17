"use server";

import { cookies } from "next/headers";
import { CookieKeys } from "./cookies";

export async function getServerCookie(
  key: CookieKeys
): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setServerCookie(
  key: CookieKeys,
  value: string,
  options?: { path?: string; maxAge?: number }
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
}

export async function deleteServerCookie(key: CookieKeys): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}
