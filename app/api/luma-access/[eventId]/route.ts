import { rejectUntrusted } from "app/lib/server/requestGuards";
import { getLumaEvent, getLumaGuests, verifyPodiumUser } from "app/services/api/luma/server";
import { NextRequest, NextResponse } from "next/server";

const EVENT_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

/** Whether the signed-in user is a guest or host of the Luma event, without exposing the guest list. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const rejected = rejectUntrusted(request);
  if (rejected) return rejected;
  const { eventId } = await params;
  if (!EVENT_ID_REGEX.test(eventId)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
  const user = await verifyPodiumUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const email = user.email?.toLowerCase();
  const loginType = user.login_type ?? "";
  if (!email || !(loginType.includes("google") || loginType.includes("email"))) {
    return NextResponse.json({ allowed: false });
  }

  try {
    const [guests, event] = await Promise.all([getLumaGuests(eventId), getLumaEvent(eventId)]);
    const allowed =
      guests.some((g) => g.guest?.user_email?.toLowerCase() === email) ||
      (event?.hosts ?? []).some((h) => h.email?.toLowerCase() === email);
    return NextResponse.json({ allowed }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    console.error("Luma access check failed:", error);
    return NextResponse.json({ error: "Luma unavailable" }, { status: 502 });
  }
}
