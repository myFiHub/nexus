"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { AppPages } from "app/lib/routes";
import { OutpostModel } from "app/services/api/types";
import { BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

/** Shown only to the host and cohosts, who are the ones allowed to see the numbers. */
export const AnalyticsLink = ({ outpost }: { outpost: OutpostModel }) => {
  const myUuid = useSelector(GlobalSelectors.podiumUserInfo)?.uuid;
  if (!myUuid) return null;
  const isHost =
    outpost.creator_user_uuid === myUuid || !!outpost.cohost_user_uuids?.includes(myUuid);
  if (!isHost) return null;

  return (
    <Link
      href={`${AppPages.outpostAnalytics(outpost.uuid)}?name=${encodeURIComponent(outpost.name)}`}
      className="glass-card press flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[color-mix(in_oklab,var(--p-accent)_18%,transparent)] text-[var(--p-accent)]">
        <BarChart3 className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">Outpost analytics</span>
        <span className="block text-xs text-text-muted">Listeners, retention and earnings</span>
      </span>
      <ChevronRight className="h-4 w-4 text-text-faint" />
    </Link>
  );
};
