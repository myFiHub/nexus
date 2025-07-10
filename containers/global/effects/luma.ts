import { lumaApi } from "app/services/api/luma";
import { OutpostModel } from "app/services/api/types";
import { OutpostAccesses } from "./types";
import { getStore } from "app/store";

export async function _checkLumaAccess({
  outpost,
}: {
  outpost: OutpostModel;
}): Promise<OutpostAccesses | undefined> {
  try {
    if (outpost.luma_event_id != null && outpost.luma_event_id.length > 0) {
      const store = getStore();
      const myUser = store.getState().global.podiumUserInfo!;

      const myLoginType = myUser.login_type;
      if (myLoginType != null) {
        if (myLoginType.includes("google") || myLoginType.includes("email")) {
          const myEmail = myUser.email;
          if (!myEmail) return undefined;

          const [guests, event] = await Promise.all([
            lumaApi.getGuests(outpost.luma_event_id!),
            lumaApi.getEvent(outpost.luma_event_id!),
          ]);

          const guestsList = guests.map((e) => e.guest);
          const hostsList = event?.hosts ?? [];
          const guestEmails = guestsList.map((e) => e.user_email);
          const hostsEmails = hostsList.map((e) => e.email);
          const isGuest = guestEmails.includes(myEmail);
          const isHost = hostsEmails.includes(myEmail);

          if (isGuest || isHost) {
            return { canEnter: true, canSpeak: true };
          }
        }
      }
    }
    return undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
