import { OutpostModel } from "app/services/api/types";
import { OutpostAccesses } from "./types";

export async function _checkLumaAccess({
  outpost,
}: {
  outpost: OutpostModel;
}): Promise<OutpostAccesses | undefined> {
  const eventId = outpost.luma_event_id;
  if (!eventId) return undefined;
  try {
    const response = await fetch(`/api/luma-access/${encodeURIComponent(eventId)}`, {
      credentials: "same-origin",
    });
    if (!response.ok) return undefined;
    const { allowed } = (await response.json()) as { allowed?: boolean };
    return allowed ? { canEnter: true, canSpeak: true } : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
