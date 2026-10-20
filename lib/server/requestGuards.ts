import "server-only";

import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ADDRESS_REGEX = /^0x[0-9a-f]{1,64}$/i;

export const isUuid = (value: string) => UUID_REGEX.test(value);

/** User pages are addressed by uuid or by Move/EVM address. */
export const isUserKey = (value: string) => isUuid(value) || ADDRESS_REGEX.test(value);

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

const hasValidSecret = (request: NextRequest) => {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret");
  return !!secret && !!provided && safeEqual(provided, secret);
};

/**
 * Browsers send Sec-Fetch-Site and Origin on POST, so a same-origin check stops
 * cross-site forms, crawlers and other sites from busting the cache.
 * Server-to-server callers use the REVALIDATE_SECRET header instead.
 */
const isSameOrigin = (request: NextRequest) => {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
};

/** Returns a 403 response when the caller isn't this site or a trusted server. */
export const rejectUntrusted = (request: NextRequest): NextResponse | null =>
  hasValidSecret(request) || isSameOrigin(request)
    ? null
    : NextResponse.json({ error: "Forbidden" }, { status: 403 });
