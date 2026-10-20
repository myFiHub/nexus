import "server-only";

import { CookieKeys } from "app/lib/client-cookies";
import { User } from "app/services/api/types";
import { NextRequest } from "next/server";
import type { GuestModel, LumaEventModel } from "./index";

export const LUMA_DIRECT_URL = "https://api.lu.ma";

/** Prefer the server-only name; the public one is a fallback until the env is renamed. */
export const lumaApiKey = () =>
  process.env.LUMA_API_KEY || process.env.NEXT_PUBLIC_LUMA_API_KEY || undefined;

export const lumaFetch = (path: string, init?: RequestInit) => {
  const key = lumaApiKey();
  if (!key) throw new Error("Luma API key not configured");
  return fetch(`${LUMA_DIRECT_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
      "x-luma-api-key": key,
    },
  });
};

export const getLumaEvent = async (eventId: string): Promise<LumaEventModel | undefined> => {
  try {
    const response = await lumaFetch(
      `/public/v1/event/get?api_id=${encodeURIComponent(eventId)}`,
      { next: { revalidate: 300 } }
    );
    return response.ok ? ((await response.json()) as LumaEventModel) : undefined;
  } catch (error) {
    console.error("Error getting Luma event:", error);
    return undefined;
  }
};

export const getLumaGuests = async (eventId: string): Promise<GuestModel[]> => {
  const response = await lumaFetch(
    `/public/v1/event/get-guests?event_api_id=${encodeURIComponent(eventId)}`,
    { cache: "no-store" }
  );
  if (!response.ok) return [];
  const body = await response.json();
  return (body.entries ?? []) as GuestModel[];
};

/** Resolves the Podium user behind the request's session token, or null. */
export const verifyPodiumUser = async (request: NextRequest): Promise<User | null> => {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : request.cookies.get(CookieKeys.token)?.value;
  const apiUrl = process.env.NEXT_PUBLIC_PODIUM_API_URL;
  if (!token || !apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = await response.json();
    return (body?.data as User) ?? null;
  } catch {
    return null;
  }
};
