import { OutpostBanInfo } from "app/services/api/types";

/** A kick stops applying once it runs out, even before the outpost is fetched again. */
export const isBanActive = (
  ban: { expires_at?: number | null } | null | undefined,
  nowMs: number
) =>
  !!ban && (ban.expires_at == null || ban.expires_at > nowMs);

/** "5 minutes", "2 hours", "3 days" until `untilMs`, rounded up. */
export const formatTimeUntil = (untilMs: number, nowMs: number) => {
  const minutes = Math.ceil((untilMs - nowMs) / 60_000);
  if (minutes <= 1) return "a minute";
  if (minutes < 120) return `${minutes} minutes`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) return `${hours} hours`;
  return `${Math.ceil(hours / 24)} days`;
};

export const banNotice = (ban: OutpostBanInfo, nowMs: number, outpostName?: string) => {
  const where = outpostName || "this outpost";
  const isKick = ban.kind === "kick" && ban.expires_at != null;
  return isKick
    ? {
        isKick,
        title: "You were removed from the outpost",
        message: `A host removed you from ${where}. You can join again in ${formatTimeUntil(ban.expires_at!, nowMs)}.`,
      }
    : {
        isKick,
        title: "You're blocked from this outpost",
        message: `A host blocked you from ${where}. You can't join it unless a host lets you back in.`,
      };
};
