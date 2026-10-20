"use client";

import { useClock } from "app/lib/clock";
import { banNotice, isBanActive } from "app/lib/outpostBans";
import { Ban, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { outpostDetailsSelectors } from "../selectors";

/** Tells a visitor a host removed or blocked them from this outpost. */
export const MyBanBanner = () => {
  const ban = useSelector(outpostDetailsSelectors.outpost)?.my_ban;
  const message = useClock(
    (now) => (now !== null && ban && isBanActive(ban, now) ? banNotice(ban, now).message : null),
    30_000
  );
  if (!message || !ban) return null;
  const Icon = ban.kind === "kick" && ban.expires_at != null ? LogOut : Ban;
  return (
    <div
      role="status"
      className="animate-entrance mb-6 flex items-start gap-3 rounded-[18px] border border-[color-mix(in_oklab,var(--p-danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--p-danger)_10%,transparent)] p-4 text-sm"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--p-danger)]" />
      <p className="text-foreground">{message}</p>
    </div>
  );
};
