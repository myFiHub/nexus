"use client";

import {
  GlassCard,
  IconTile,
  LiveDot,
  Rail,
  RailItem,
  SectionHeader,
  Skeleton,
} from "app/components/aurora";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useClock } from "app/lib/clock";
import { compactMinutes, weekdayInitial } from "app/lib/format";
import { AppPages } from "app/lib/routes";
import { useVisiblePolling } from "app/lib/useVisiblePolling";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import {
  DiscoveredOutpost,
  HomeActivity,
  HomeFeed,
  LiveSessionMember,
  OutpostModel,
} from "app/services/api/types";
import { BarChart3, Compass, Flame, LayoutGrid, PartyPopper, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  LiveCard,
  PersonCard,
  presenceLine,
  QuickAction,
  RecentCard,
  UpNextCard,
} from "./cards";

const FEED_TTL_MS = 2 * 60_000;
const LIVE_POLL_MS = 60_000;

interface LiveItem {
  outpost: OutpostModel;
  online: number;
  line: string;
  people: LiveSessionMember[];
}

const Greeting = ({ name }: { name?: string }) => {
  const greeting = useClock((now) => {
    if (now === null) return "Welcome back";
    const hour = new Date(now).getHours();
    if (hour < 5) return "Up late";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, 60_000);
  const first = name?.split(" ")[0];
  return (
    <div className="animate-entrance">
      <p className="label-caps">Home</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {greeting}
        {first ? <>, <span className="text-grad">{first}</span></> : null}
      </h1>
    </div>
  );
};

type Delta = { label: string; up: boolean } | null;

const minutesDelta = (now: number, before: number): Delta => {
  const diff = Math.round(now) - Math.round(before);
  if (diff === 0) return null;
  if (Math.round(before) === 0) return { label: "new", up: true };
  return { label: compactMinutes(Math.abs(diff)), up: diff > 0 };
};

const countDelta = (now: number, before: number): Delta => {
  const diff = now - before;
  if (diff === 0) return null;
  if (before === 0) return { label: "new", up: true };
  return { label: `${Math.abs(diff)}`, up: diff > 0 };
};

const Stat = ({ label, value, delta }: { label: string; value: string; delta: Delta }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-0.5 flex items-end gap-1.5">
      <span className="text-xl font-bold text-foreground tabular-nums">{value}</span>
      {delta && (
        <span
          className={cn(
            "pb-0.5 text-[11px] font-bold",
            delta.up ? "text-[var(--p-success)]" : "text-text-faint"
          )}
        >
          {delta.label === "new" ? "new" : `${delta.up ? "↑" : "↓"} ${delta.label}`}
        </span>
      )}
    </p>
  </div>
);

const DayDots = ({ days }: { days: boolean[] }) => {
  const today = useClock((now) => (now === null ? null : new Date(now).setHours(0, 0, 0, 0)), 60_000);
  return (
    <div className="flex gap-1.5" aria-label="Last 7 days">
      {days.map((active, i) => {
        const isToday = i === days.length - 1;
        const dayMs = today === null ? null : today - (days.length - 1 - i) * 86_400_000;
        return (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span
              className={cn(
                "h-3.5 w-3.5 rounded-full border",
                active ? "border-primary bg-primary" : "border-border bg-surface-raised",
                isToday && "ring-2 ring-primary/40"
              )}
            />
            <span
              className={cn(
                "text-[9px] font-bold",
                isToday ? "text-primary" : "text-text-faint"
              )}
            >
              {dayMs === null ? "\u00a0" : weekdayInitial(dayMs)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const YourWeek = ({ activity }: { activity: HomeActivity }) => {
  const now = activity.current;
  const before = activity.previous;
  const streak = activity.streak_days;
  const empty =
    !now.listen_minutes && !now.speak_minutes && !now.outposts_joined && !now.new_followers &&
    !before.listen_minutes && !before.speak_minutes && !before.outposts_joined && !before.new_followers;
  const title = streak === 0 ? "No streak yet" : `${streak} day streak`;
  const subtitle =
    streak === 0
      ? "Join an outpost today to start one"
      : activity.active_today
        ? "You showed up today"
        : "Join an outpost today to keep it going";

  return (
    <section>
      <SectionHeader title="Your week" />
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <IconTile tone={streak > 0 ? "accent" : "violet"} size={40}>
            <Flame className="h-5 w-5" />
          </IconTile>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{title}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <DayDots days={activity.last_7_days} />
        </div>
        {empty ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Join an outpost to start filling this in. Time listening, time on the mic and new
            followers show up here.
          </p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat
                label="Listened"
                value={compactMinutes(now.listen_minutes)}
                delta={minutesDelta(now.listen_minutes, before.listen_minutes)}
              />
              <Stat
                label="On the mic"
                value={compactMinutes(now.speak_minutes)}
                delta={minutesDelta(now.speak_minutes, before.speak_minutes)}
              />
              <Stat
                label="Outposts"
                value={`${now.outposts_joined}`}
                delta={countDelta(now.outposts_joined, before.outposts_joined)}
              />
              <Stat
                label="New followers"
                value={`${now.new_followers}`}
                delta={countDelta(now.new_followers, before.new_followers)}
              />
            </div>
            {now.cheers_received > 0 && (
              <div
                className="mt-4 flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm font-medium"
                style={{
                  color: "var(--p-accent)",
                  background: "color-mix(in oklab, var(--p-accent) 12%, transparent)",
                }}
              >
                <PartyPopper className="h-4 w-4 shrink-0" />
                {now.cheers_received === 1
                  ? "Someone cheered for you this week"
                  : `${now.cheers_received} cheers for you this week`}
              </div>
            )}
          </>
        )}
      </GlassCard>
    </section>
  );
};

const RailSkeleton = ({ width, height }: { width: number; height: number }) => (
  <Rail>
    {[0, 1, 2, 3].map((i) => (
      <RailItem key={i} index={i}>
        <Skeleton style={{ width, height }} />
      </RailItem>
    ))}
  </Rail>
);

export const MemberHome = () => {
  const user = useSelector(GlobalSelectors.podiumUserInfo);
  return <MemberFeed key={user?.uuid ?? "pending"} userId={user?.uuid} name={user?.name} />;
};

const fetchLive = () =>
  Promise.all([
    podiumApi.getLiveFromFollowings(12),
    podiumApi.getMyOutposts(false, 0, 30),
  ]);

const MemberFeed = ({ userId, name }: { userId?: string; name?: string }) => {
  const [feed, setFeed] = useState<HomeFeed | undefined>();
  const [feedAt, setFeedAt] = useState(0);
  const [feedLoading, setFeedLoading] = useState(true);
  const [liveFromFollowings, setLiveFromFollowings] = useState<DiscoveredOutpost[]>([]);
  const [myOutposts, setMyOutposts] = useState<OutpostModel[] | undefined>();

  const applyFeed = useCallback((result: HomeFeed | undefined) => {
    if (result) {
      setFeed(result);
      setFeedAt(Date.now());
    }
    setFeedLoading(false);
  }, []);

  const applyLive = useCallback(
    ([live, mine]: [DiscoveredOutpost[], OutpostModel[]]) => {
      setLiveFromFollowings(live);
      setMyOutposts(mine);
    },
    []
  );

  const loadFeed = useCallback(
    () => podiumApi.getHomeFeed(-new Date().getTimezoneOffset()).then(applyFeed),
    [applyFeed]
  );

  const loadLive = useCallback(
    () => fetchLive().then(applyLive),
    [applyLive]
  );

  useEffect(() => {
    if (!userId) return;
    let active = true;
    podiumApi
      .getHomeFeed(-new Date().getTimezoneOffset())
      .then((result) => active && applyFeed(result));
    fetchLive().then((result) => active && applyLive(result));
    return () => {
      active = false;
    };
  }, [userId, applyFeed, applyLive]);

  useVisiblePolling(
    () => {
      loadLive();
      if (Date.now() - feedAt > FEED_TTL_MS) loadFeed();
    },
    LIVE_POLL_MS,
    !!userId
  );

  const happeningNow = useMemo<LiveItem[]>(() => {
    const items: LiveItem[] = [];
    const seen = new Set<string>();
    for (const outpost of myOutposts ?? []) {
      const online = outpost.online_users_count ?? 0;
      if (online <= 0 || outpost.is_archived) continue;
      seen.add(outpost.uuid);
      items.push({
        outpost,
        online,
        line: outpost.creator_user_uuid === userId ? "Your outpost is live" : "One of your outposts",
        people: [],
      });
    }
    for (const item of liveFromFollowings) {
      if (seen.has(item.uuid)) continue;
      seen.add(item.uuid);
      items.push({
        outpost: item,
        online: item.online_users_count ?? 0,
        line: presenceLine(item),
        people: item.followed_users_in_room,
      });
    }
    return items;
  }, [myOutposts, liveFromFollowings, userId]);

  const yourOutposts = useMemo(
    () =>
      (myOutposts ?? [])
        .filter((o) => !o.is_archived)
        .sort((a, b) => (b.last_active_at ?? 0) - (a.last_active_at ?? 0))
        .slice(0, 12),
    [myOutposts]
  );

  const loadingFeed = !feed && feedLoading;

  return (
    <div className="flex flex-col gap-8">
      <Greeting name={name} />

      <div className="grid grid-cols-4 gap-2 sm:max-w-xl">
        <QuickAction href={AppPages.createOutpost} label="Start" tone="accent" icon={<Plus className="h-5 w-5" />} />
        <QuickAction href={AppPages.allOutposts} label="Explore" tone="violet" icon={<Compass className="h-5 w-5" />} />
        <QuickAction href={AppPages.analytics} label="Insights" tone="success" icon={<BarChart3 className="h-5 w-5" />} />
        <QuickAction href={AppPages.myOutposts} label="Mine" tone="magenta" icon={<LayoutGrid className="h-5 w-5" />} />
      </div>

      {happeningNow.length > 0 && (
        <section>
          <SectionHeader
            title="Happening now"
            count={happeningNow.length}
            trailing={<LiveDot />}
          />
          <Rail label="Happening now">
            {happeningNow.map((item, i) => (
              <RailItem key={item.outpost.uuid} index={i}>
                <LiveCard
                  outpost={item.outpost}
                  online={item.online}
                  line={item.line}
                  people={item.people}
                />
              </RailItem>
            ))}
          </Rail>
        </section>
      )}

      {loadingFeed ? (
        <section>
          <SectionHeader title="Your week" />
          <Skeleton className="h-[170px] rounded-[18px]" />
        </section>
      ) : (
        feed && <YourWeek activity={feed.activity} />
      )}

      {loadingFeed ? (
        <section>
          <SectionHeader title="Up next" />
          <RailSkeleton width={260} height={140} />
        </section>
      ) : (
        !!feed?.up_next.length && (
          <section>
            <SectionHeader title="Up next" count={feed.up_next.length} />
            <Rail label="Up next">
              {feed.up_next.map((item, i) => (
                <RailItem key={item.uuid} index={i}>
                  <UpNextCard item={item} />
                </RailItem>
              ))}
            </Rail>
          </section>
        )
      )}

      {!!feed?.jump_back_in.length && (
        <section>
          <SectionHeader title="Jump back in" />
          <Rail label="Jump back in">
            {feed.jump_back_in.map((item, i) => (
              <RailItem key={item.uuid} index={i}>
                <RecentCard item={item} />
              </RailItem>
            ))}
          </Rail>
        </section>
      )}

      {!!feed?.suggested_people.length && (
        <section>
          <SectionHeader title="People to follow" />
          <Rail label="People to follow">
            {feed.suggested_people.map((person, i) => (
              <RailItem key={person.uuid} index={i}>
                <PersonCard user={person} />
              </RailItem>
            ))}
          </Rail>
        </section>
      )}

      {yourOutposts.length > 0 && (
        <section>
          <SectionHeader
            title="Your outposts"
            trailing={
              <Link href={AppPages.myOutposts} className="text-sm font-semibold text-primary hover:underline">
                See all
              </Link>
            }
          />
          <Rail label="Your outposts">
            {yourOutposts.map((outpost, i) => (
              <RailItem key={outpost.uuid} index={i}>
                <RecentCard
                  item={{ ...outpost, last_listened_at: outpost.last_active_at, listened_minutes: 0 }}
                />
              </RailItem>
            ))}
          </Rail>
        </section>
      )}
    </div>
  );
};
