"use client";

import { IconTile } from "app/components/aurora";
import { Img } from "app/components/Img";
import { setBlocked, useBlockedUsers } from "app/lib/blockedUsers";
import { logoUrl } from "app/lib/constants";
import { useClock } from "app/lib/clock";
import { agoLabel } from "app/lib/format";
import { referralLink } from "app/lib/referral";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { BlockedUser, User } from "app/services/api/types";
import { Ban, Check, Copy, Gift, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ReferralsCard = ({ user }: { user: User }) => {
  const [copied, setCopied] = useState(false);
  const remaining = user.remaining_referrals_count ?? 0;
  const total = (user.referrals_count ?? 0) + remaining;
  if (total === 0) return null;
  const link = referralLink(user.uuid);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: "Join me on Podium Nexus", url: link });
    } catch {}
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <IconTile tone="magenta">
          <Gift className="h-4 w-4" />
        </IconTile>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground">
            {remaining > 0 ? "Refer a friend" : "All referrals used"}
          </h4>
          <p className="text-sm text-text-muted">
            {remaining > 0
              ? `${remaining} of ${total} invites left. Friends who join with your link are linked to you.`
              : `You've referred ${user.referrals_count ?? 0} people.`}
          </p>
        </div>
      </div>
      {remaining > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-[12px] border border-border/60 bg-surface/60 px-3 py-2 text-xs text-text-muted">
            {link}
          </code>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy referral link"
            className="press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-text-muted transition-colors hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-[var(--p-success)]" /> : <Copy className="h-4 w-4" />}
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={share}
              aria-label="Share referral link"
              className="press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-text-muted transition-colors hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const BlockedAgo = ({ at }: { at: number }) => {
  const label = useClock((now) => (now === null ? null : agoLabel(at, now)), 60_000);
  if (!label) return null;
  return <span className="block text-xs text-text-faint">Blocked {label}</span>;
};

const BlockedRow = ({ person }: { person: BlockedUser }) => {
  const [busy, setBusy] = useState(false);
  const unblock = async () => {
    setBusy(true);
    const ok = await setBlocked(person, false);
    setBusy(false);
    if (ok) toast.success(`Unblocked ${person.name || "user"}`);
    else toast.error("Something went wrong. Please try again.");
  };
  return (
    <li className="flex items-center gap-3 py-2.5">
      <Link href={AppPages.userDetails(person.uuid)} className="flex min-w-0 flex-1 items-center gap-3">
        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-raised">
          <Img
            src={person.image || logoUrl}
            alt={person.name || "User"}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground">
            {person.name || "Anonymous"}
          </span>
          <BlockedAgo at={person.blocked_at} />
        </span>
      </Link>
      <button
        type="button"
        onClick={unblock}
        disabled={busy}
        className="press shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-border-strong disabled:opacity-50"
      >
        Unblock
      </button>
    </li>
  );
};

const BlockedPeople = ({ myUuid }: { myUuid: string }) => {
  const { users, loaded } = useBlockedUsers(myUuid);
  const sorted = [...users].sort((a, b) => b.blocked_at - a.blocked_at);
  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <IconTile tone="danger">
          <Ban className="h-4 w-4" />
        </IconTile>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground">Blocked people</h4>
          <p className="text-sm text-text-muted">
            {!loaded
              ? "Loading…"
              : sorted.length === 0
                ? "Nobody blocked. You can block someone from their profile."
                : `${sorted.length} ${sorted.length === 1 ? "person" : "people"} can't interact with you.`}
          </p>
        </div>
      </div>
      {sorted.length > 0 && (
        <ul className="mt-2 divide-y divide-border/50">
          {sorted.map((person) => (
            <BlockedRow key={person.uuid} person={person} />
          ))}
        </ul>
      )}
    </div>
  );
};

export const SocialSection = ({ user }: { user: User }) => (
  <div className="mb-8">
    <h3 className="mb-4 text-lg font-semibold text-foreground">Community</h3>
    <div className="grid gap-3 md:grid-cols-2">
      <ReferralsCard user={user} />
      <BlockedPeople myUuid={user.uuid} />
    </div>
  </div>
);
