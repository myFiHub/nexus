"use client";

import { AvatarStack, LiveDot, OutpostThumb, Pill } from "app/components/aurora";
import { confirmDialog } from "app/components/Dialog/confirmDialog";
import { Popover, PopoverContent, PopoverTrigger } from "app/components/Popover";
import { FollowButton } from "app/containers/_users/components/followButton";
import { GlobalSelectors } from "app/containers/global/selectors";
import { isBlocked, setBlocked, useBlockedUsers } from "app/lib/blockedUsers";
import { compactNumber } from "app/lib/format";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { useVisiblePolling } from "app/lib/useVisiblePolling";
import podiumApi from "app/services/api";
import { DiscoveredOutpost, FollowerModel, User } from "app/services/api/types";
import { Ban, Headphones, MoreHorizontal, UserCheck } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useMyUuid = () => useSelector(GlobalSelectors.podiumUserInfo)?.uuid;

const useFollowsMe = (followings: FollowerModel[]) => {
  const myUuid = useMyUuid();
  return !!myUuid && followings.some((f) => f.uuid === myUuid);
};

export const FollowsYouPill = ({ followings }: { followings: FollowerModel[] }) => {
  if (!useFollowsMe(followings)) return null;
  return (
    <Pill>
      <UserCheck className="h-3 w-3" />
      Follows you
    </Pill>
  );
};

const ProfileMenu = ({ user }: { user: User }) => {
  const myUuid = useMyUuid();
  const { users, loaded } = useBlockedUsers(myUuid);
  const [open, setOpen] = useState(false);
  if (!myUuid || myUuid === user.uuid) return null;
  const blocked = isBlocked(users, user.uuid);
  const name = user.name || "this person";

  const toggle = async () => {
    setOpen(false);
    if (!blocked) {
      const { confirmed } = await confirmDialog({
        title: `Block ${name}?`,
        content:
          "They won't be able to message you or interact with you in outposts. You can unblock them anytime from your profile.",
        confirmOpts: { text: "Block", variant: "destructive" },
        cancelOpts: { text: "Cancel" },
      });
      if (!confirmed) return;
    }
    const ok = await setBlocked(
      { uuid: user.uuid, address: user.address, name: user.name, image: user.image },
      !blocked
    );
    if (ok) toast.success(blocked ? `Unblocked ${name}` : `Blocked ${name}`);
    else toast.error("Something went wrong. Please try again.");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className="press inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-text-muted transition-colors hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-48 rounded-[18px] p-1.5">
        <button
          type="button"
          onClick={toggle}
          disabled={!loaded}
          className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-sm text-[var(--p-danger)] hover:bg-[color-mix(in_oklab,var(--p-danger)_12%,transparent)] disabled:opacity-50"
        >
          <Ban className="h-4 w-4" />
          {blocked ? "Unblock" : "Block"}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export const ProfileActions = ({
  user,
  followings,
}: {
  user: User;
  followings: FollowerModel[];
}) => {
  const followsMe = useFollowsMe(followings);
  return (
    <div className="flex items-center gap-2">
      <FollowButton
        className="min-w-24"
        id={user.uuid}
        noScale
        size="md"
        followed={!!user.followed_by_me}
        address={user.address}
        followsYou={followsMe}
      />
      <ProfileMenu user={user} />
    </div>
  );
};

/** "Followed by A, B and 3 others you follow", from the viewer's own follow graph. */
export const MutualFollowers = ({ userId }: { userId: string }) => {
  const myUuid = useMyUuid();
  const [mutual, setMutual] = useState<FollowerModel[]>([]);

  useEffect(() => {
    if (!myUuid) return;
    let active = true;
    podiumApi.getFollowersOfUser(userId).then((followers) => {
      if (active) setMutual(followers.filter((f) => f.followed_by_me && f.uuid !== myUuid));
    });
    return () => {
      active = false;
    };
  }, [myUuid, userId]);

  if (!myUuid || mutual.length === 0) return null;
  const names = mutual.slice(0, 2).map((f) => f.name || "someone");
  const others = mutual.length - names.length;
  return (
    <p className="animate-entrance mt-4 flex items-center gap-2 text-xs text-text-muted">
      <AvatarStack people={mutual} size={22} />
      <span className="min-w-0">
        Followed by <span className="font-semibold text-foreground">{names.join(", ")}</span>
        {others > 0 && ` and ${others} other${others > 1 ? "s" : ""}`} you follow
      </span>
    </p>
  );
};

const LIVE_POLL_MS = 60_000;

/** The outpost this person is hosting right now, if any. */
export const LiveNowCard = ({ userId }: { userId: string }) => {
  const [live, setLive] = useState<DiscoveredOutpost | null>(null);

  const poll = useCallback(() => {
    podiumApi.getLiveOutposts(50).then((outposts) => {
      setLive(outposts.find((o) => o.creator_user_uuid === userId) ?? null);
    });
  }, [userId]);
  useEffect(poll, [poll]);
  useVisiblePolling(poll, LIVE_POLL_MS);

  if (!live) return null;
  const listening = live.online_users_count ?? 0;
  return (
    <Link
      href={AppPages.outpostDetails(live.uuid)}
      className="glass-card press animate-entrance mt-6 flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5"
    >
      <OutpostThumb image={live.image} name={live.name} size={52} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--p-danger)]">
          <LiveDot />
          Live now
        </p>
        <p className="truncate font-semibold text-foreground">{live.name}</p>
        {listening > 0 && (
          <p className="flex items-center gap-1 text-xs text-text-muted">
            <Headphones className="h-3 w-3" />
            {compactNumber(listening)} listening
          </p>
        )}
      </div>
      <span className="btn-aurora shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-[var(--p-on-accent)]">
        Join
      </span>
    </Link>
  );
};
