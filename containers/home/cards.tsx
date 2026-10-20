"use client";

import {
  AvatarStack,
  GlassCard,
  OutpostThumb,
  Pill,
  Tone,
  toneStyle,
} from "app/components/aurora";
import { reminderDialog } from "app/components/Dialog/reminder";
import { Img } from "app/components/Img";
import { useClock } from "app/lib/clock";
import { agoLabel, compactMinutes, compactNumber, monthShort, whenLabel } from "app/lib/format";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import {
  DiscoveredOutpost,
  LiveSessionMember,
  OutpostModel,
  RecentOutpost,
  SuggestedUser,
  UpNextOutpost,
  UpNextReason,
} from "app/services/api/types";
import { Bell, BellRing, Flame, Headphones, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const outpostHref = (id: string) => AppPages.outpostDetails(id);

export const LiveCard = ({
  outpost,
  online,
  line,
  people = [],
}: {
  outpost: OutpostModel;
  online: number;
  line: string;
  people?: LiveSessionMember[];
}) => (
  <Link href={outpostHref(outpost.uuid)} className="block w-[280px] focus-visible:outline-none">
    <GlassCard
      interactive
      className="flex items-center gap-3 p-3"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--p-danger) 12%, transparent), var(--glass))",
      }}
    >
      <OutpostThumb image={outpost.image} name={outpost.name} size={64} />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {outpost.name}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          {people.length > 0 && <AvatarStack people={people} size={18} />}
          <p className="truncate text-xs text-muted-foreground">{line}</p>
        </div>
        <Pill tone="danger" className="mt-1.5">
          <Headphones className="h-3 w-3" />
          {online} listening
        </Pill>
      </div>
    </GlassCard>
  </Link>
);

export const presenceLine = (item: DiscoveredOutpost) => {
  const count = item.followed_users_in_room_count;
  const first = item.followed_users_in_room[0]?.name;
  if (count > 0 && first) {
    return count === 1 ? `${first} is inside` : `${first} +${count - 1} inside`;
  }
  if (count > 0) return `${count} you follow inside`;
  if (item.host_is_followed) return "Host you follow";
  return `by ${item.creator_user_name}`;
};

/** Larger cover card for public Live / Trending rails. */
export const CoverCard = ({
  outpost,
  stat,
}: {
  outpost: DiscoveredOutpost;
  stat: "live" | "trending";
}) => {
  const online = outpost.online_users_count ?? 0;
  return (
    <Link href={outpostHref(outpost.uuid)} className="block w-[240px] focus-visible:outline-none">
      <GlassCard interactive className="overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[18px]">
          <Img
            src={outpost.image || undefined}
            alt={outpost.name}
            fill
            sizes="240px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {online > 0 && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--p-danger)]" />
              LIVE · {online}
            </span>
          )}
          <div className="absolute inset-x-3 bottom-2 flex items-center gap-1.5">
            <span className="h-5 w-5 overflow-hidden rounded-full ring-1 ring-white/40">
              <Img
                src={outpost.creator_user_image || undefined}
                alt={outpost.creator_user_name}
                width={20}
                height={20}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="truncate text-xs font-medium text-white/90">
              {outpost.creator_user_name}
            </span>
          </div>
        </div>
        <div className="p-3">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">{outpost.name}</p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
            {stat === "trending" ? (
              <>
                <span className="inline-flex items-center gap-1">
                  <Headphones className="h-3.5 w-3.5" />
                  {compactNumber(outpost.recent_listeners)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5" />
                  {compactNumber(outpost.recent_reactions)}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Headphones className="h-3.5 w-3.5" />
                {online} listening now
              </span>
            )}
            {outpost.tags?.[0] && (
              <span className="ml-auto truncate rounded-full bg-surface-raised px-2 py-0.5 text-[11px]">
                #{outpost.tags[0]}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
};

const reasonStyle: Record<UpNextReason, [string, Tone]> = {
  hosting: ["Hosting", "accent"],
  cohosting: ["Cohosting", "accent"],
  member: ["Joined", "violet"],
  invited: ["Invited", "accent"],
  followed_host: ["You follow", "magenta"],
};

const WhenLabel = ({ at }: { at: number }) => {
  const label = useClock((now) => (now === null ? "\u00a0" : whenLabel(at, now)), 30_000);
  return <>{label}</>;
};

export const UpNextCard = ({ item }: { item: UpNextOutpost }) => {
  const [reminderSet, setReminderSet] = useState(item.reminder_set);
  const [busy, setBusy] = useState(false);
  const at = item.scheduled_for;
  const [reasonLabel, reasonTone] = reasonStyle[item.reason] ?? ["Upcoming", "accent"];

  const toggleReminder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const res = await reminderDialog({
      title: reminderSet ? "Change reminder" : "Set reminder",
      content: "When would you like to be reminded?",
      scheduledFor: at,
      confirmOpts: { text: "Save" },
      cancelOpts: { text: "Cancel" },
    });
    if (!res.confirmed) return;
    const minutes = res.reminderMinutes ?? 0;
    const removing = minutes === -1;
    setBusy(true);
    setReminderSet(!removing);
    const ok = await podiumApi.setOrRemoveReminder({
      uuid: item.uuid,
      reminder_offset_minutes: removing ? undefined : minutes,
    });
    setBusy(false);
    if (!ok) {
      setReminderSet(reminderSet);
      toast.error("Couldn't update the reminder");
    }
  };

  return (
    <Link href={outpostHref(item.uuid)} className="block w-[260px] focus-visible:outline-none">
      <GlassCard interactive className="flex h-[140px] flex-col p-3">
        <div className="flex items-start gap-2.5">
          <div
            className="flex w-11 shrink-0 flex-col items-center rounded-[12px] border py-1.5"
            style={{
              borderColor: "color-mix(in oklab, var(--p-accent) 30%, transparent)",
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--p-accent) 16%, transparent), color-mix(in oklab, var(--p-violet) 12%, transparent))",
            }}
          >
            <span className="text-[9px] font-extrabold tracking-wider text-primary">
              {monthShort(at)}
            </span>
            <span className="text-lg font-bold leading-tight text-foreground tabular-nums">
              {new Date(at).getDate()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-primary">
              <WhenLabel at={at} />
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
              {item.name}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleReminder}
            disabled={busy}
            aria-label={reminderSet ? "Change reminder" : "Set reminder"}
            aria-pressed={reminderSet}
            className={cn(
              "press -mr-1 -mt-1 rounded-full p-1.5 transition-colors hover:bg-surface-raised",
              reminderSet ? "text-primary" : "text-text-faint"
            )}
          >
            {reminderSet ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <Pill tone={reasonTone}>{reasonLabel}</Pill>
          <span className="ml-auto truncate text-xs text-muted-foreground">
            by {item.creator_user_name || "someone"}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
};

const RecentLine = ({ item, online }: { item: RecentOutpost; online: number }) => {
  const ago = useClock(
    (now) => (now === null ? "" : agoLabel(item.last_listened_at, now)),
    60_000
  );
  if (online > 0) return <>Live now · {online} listening</>;
  return (
    <>
      Listened {compactMinutes(item.listened_minutes)}
      {ago && ` · ${ago}`}
    </>
  );
};

export const RecentCard = ({ item }: { item: RecentOutpost }) => {
  const online = item.online_users_count ?? 0;
  return (
    <Link href={outpostHref(item.uuid)} className="block w-[260px] focus-visible:outline-none">
      <GlassCard
        interactive
        className="flex items-center gap-2.5 p-2.5"
        style={
          online > 0
            ? { boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--p-danger) 40%, transparent)" }
            : undefined
        }
      >
        <OutpostThumb image={item.image} name={item.name} size={54} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p
            className={cn(
              "mt-0.5 truncate text-xs",
              online > 0 ? "font-bold text-[var(--p-danger)]" : "text-muted-foreground"
            )}
          >
            <RecentLine item={item} online={online} />
          </p>
        </div>
        <Play
          className={cn("h-6 w-6 shrink-0", online > 0 ? "text-[var(--p-danger)]" : "text-primary")}
          fill="currentColor"
        />
      </GlassCard>
    </Link>
  );
};

export const suggestionLine = (user: SuggestedUser) => {
  switch (user.reason) {
    case "you_listened":
      return "You listened to their outposts";
    case "follows_you":
      return "Follows you";
    case "followed_by_followings": {
      const names = user.mutual_names;
      const others = user.mutual_count - names.length;
      if (names.length === 0) return `Followed by ${user.mutual_count} you follow`;
      const who = names.join(names.length === 2 && others <= 0 ? " and " : ", ");
      return others > 0 ? `Followed by ${who} and ${others} more` : `Followed by ${who}`;
    }
    case "popular_host": {
      const count = user.outposts_count;
      return count > 0
        ? `Popular host · ${count} ${count === 1 ? "outpost" : "outposts"}`
        : "Popular host";
    }
    default:
      return "";
  }
};

export const PersonCard = ({ user }: { user: SuggestedUser }) => {
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const follow = !following;
    setBusy(true);
    setFollowing(follow);
    const ok = await podiumApi.followUnfollowUser({
      uuid: user.uuid,
      action: follow ? "follow" : "unfollow",
    });
    setBusy(false);
    if (!ok) {
      setFollowing(!follow);
      toast.error(`Couldn't ${follow ? "follow" : "unfollow"} ${user.name}`);
    }
  };

  return (
    <Link href={AppPages.userDetails(user.uuid)} className="block w-[160px] focus-visible:outline-none">
      <GlassCard interactive className="flex h-[210px] flex-col items-center px-3 pb-3 pt-4 text-center">
        <span
          className="relative rounded-full p-[2px]"
          style={{
            background: user.is_live
              ? "var(--p-danger)"
              : "color-mix(in oklab, var(--p-violet) 45%, transparent)",
          }}
        >
          <span className="block h-[60px] w-[60px] overflow-hidden rounded-full bg-surface-raised">
            <Img
              src={user.image || undefined}
              alt={user.name}
              width={60}
              height={60}
              className="h-full w-full object-cover"
            />
          </span>
          {user.is_live && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[var(--p-danger)] px-1.5 text-[9px] font-extrabold text-white">
              LIVE
            </span>
          )}
        </span>
        <p className="mt-2 w-full truncate text-sm font-semibold text-foreground">{user.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
          {suggestionLine(user)}
        </p>
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className={cn(
            "press mt-auto h-8 w-full rounded-full text-xs font-bold transition-colors",
            following
              ? "border border-border text-foreground hover:border-border-strong"
              : "btn-aurora"
          )}
        >
          {following ? "Following" : user.reason === "follows_you" ? "Follow back" : "Follow"}
        </button>
      </GlassCard>
    </Link>
  );
};

export const QuickAction = ({
  href,
  label,
  tone,
  icon,
}: {
  href: string;
  label: string;
  tone: Tone;
  icon: React.ReactNode;
}) => (
  <Link href={href} className="block focus-visible:outline-none">
    <GlassCard interactive className="flex flex-col items-center gap-1.5 py-3">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-[12px]"
        style={toneStyle(tone, 18)}
      >
        {icon}
      </span>
      <span className="text-xs font-bold text-foreground">{label}</span>
    </GlassCard>
  </Link>
);
