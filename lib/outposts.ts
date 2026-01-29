import { OutpostModel } from "app/services/api/types";

/**
 * True when the outpost has at least one online user (currently live).
 */
export function isLiveOutpost(outpost: OutpostModel): boolean {
  return (outpost.online_users_count ?? 0) > 0;
}

/**
 * True when the outpost is scheduled in the future (upcoming).
 * scheduled_for is in milliseconds (API convention; matches outpost details / join flow).
 */
export function isUpcomingOutpost(outpost: OutpostModel): boolean {
  return outpost.scheduled_for > Date.now();
}

const FEATURED_EVENTS_CAP = 10;

/**
 * Returns a combined list of live (first) and upcoming (second) outposts, capped.
 * Live: sorted by online_users_count desc, then last_active_at desc.
 * Upcoming: sorted by scheduled_for asc (soonest first).
 */
export function sortFeaturedOutposts(outposts: OutpostModel[]): OutpostModel[] {
  const nowMs = Date.now();
  const live = outposts
    .filter((o) => (o.online_users_count ?? 0) > 0)
    .sort((a, b) => {
      const aOnline = a.online_users_count ?? 0;
      const bOnline = b.online_users_count ?? 0;
      if (bOnline !== aOnline) return bOnline - aOnline;
      return (b.last_active_at ?? 0) - (a.last_active_at ?? 0);
    });
  const upcoming = outposts
    .filter((o) => o.scheduled_for > nowMs)
    .sort((a, b) => a.scheduled_for - b.scheduled_for);
  return [...live, ...upcoming].slice(0, FEATURED_EVENTS_CAP);
}
