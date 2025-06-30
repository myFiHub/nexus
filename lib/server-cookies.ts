"use server";

import { cookies } from "next/headers";
import { CookieKeys } from "./client-cookies";

// Server-side cookie management using Next.js cookies() function
export async function getServerCookie(
  key: CookieKeys
): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
  } catch (error) {
    console.error("Error getting server cookie:", error);
    return undefined;
  }
}

export async function setServerCookie(
  key: CookieKeys,
  value: string,
  options?: { path?: string; maxAge?: number; expires?: Date }
): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(key, value, options);
  } catch (error) {
    console.error("Error setting server cookie:", error);
    throw error;
  }
}

export async function deleteServerCookie(key: CookieKeys): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  } catch (error) {
    console.error("Error deleting server cookie:", error);
    throw error;
  }
}
