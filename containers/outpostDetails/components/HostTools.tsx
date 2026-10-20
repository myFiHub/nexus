"use client";

import { Skeleton } from "app/components/aurora";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import { Img } from "app/components/Img";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useClock } from "app/lib/clock";
import { logoUrl } from "app/lib/constants";
import { formatTimeUntil, isBanActive } from "app/lib/outpostBans";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { OutpostBanItem, OutpostModel } from "app/services/api/types";
import { BarChart3, ChevronRight, ShieldOff } from "lucide-react";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PAGE_SIZE = 50;

const ToolRow = ({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) => (
  <>
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[color-mix(in_oklab,var(--p-accent)_18%,transparent)] text-[var(--p-accent)]">
      {icon}
    </span>
    <span className="min-w-0 flex-1 text-left">
      <span className="block text-sm font-semibold text-foreground">{title}</span>
      <span className="block text-xs text-text-muted">{subtitle}</span>
    </span>
    <ChevronRight className="h-4 w-4 text-text-faint" />
  </>
);

const rowClass =
  "press flex w-full items-center gap-3 rounded-[14px] p-3 transition-colors hover:bg-surface-raised/50";

const BanDetail = ({ item, byMe }: { item: OutpostBanItem; byMe: boolean }) => {
  const by = byMe ? "you" : item.banned_by_user_name || "a host";
  const label = useClock((now) => {
    if (item.kind === "kick" && item.expires_at != null) {
      return now === null ? `Removed by ${by}` : `Removed by ${by} · back in ${formatTimeUntil(item.expires_at, now)}`;
    }
    return `Blocked by ${by}`;
  }, 30_000);
  return <span className="block truncate text-xs text-text-muted">{label}</span>;
};

const BanRow = ({
  item,
  outpostId,
  myUuid,
  creatorUuid,
  onLifted,
}: {
  item: OutpostBanItem;
  outpostId: string;
  myUuid: string;
  creatorUuid: string;
  onLifted: (userUuid: string) => void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const isBlock = item.kind === "ban" || item.expires_at == null;
  const creatorOnly = myUuid !== creatorUuid && item.banned_by_user_uuid === creatorUuid;
  const name = item.name || "User";

  const lift = async () => {
    setBusy(true);
    const ok = await podiumApi.unbanUserFromOutpost(outpostId, item.user_uuid);
    setBusy(false);
    setConfirming(false);
    if (ok) {
      toast.success(isBlock ? `Unblocked ${name}` : `${name} can rejoin`);
      onLifted(item.user_uuid);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-raised">
        <Img src={item.image || logoUrl} alt={name} width={36} height={36} className="h-full w-full object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <BanDetail item={item} byMe={item.banned_by_user_uuid === myUuid} />
        {item.reason && <p className="truncate text-xs italic text-text-faint">“{item.reason}”</p>}
        {creatorOnly && <p className="text-[11px] text-text-faint">Only the creator can unblock</p>}
      </div>
      {!creatorOnly && (
        <LiftButton
          busy={busy}
          confirming={confirming}
          label={isBlock ? "Unblock" : "Allow back"}
          onFirst={() => setConfirming(true)}
          onCancel={() => setConfirming(false)}
          onConfirm={lift}
        />
      )}
    </li>
  );
};

const LiftButton = ({
  busy,
  confirming,
  label,
  onFirst,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  confirming: boolean;
  label: string;
  onFirst: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={onFirst}
        className="press shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-border-strong"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="rounded-full px-2 py-1.5 text-xs text-text-muted hover:text-foreground"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="btn-aurora press rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--p-on-accent)] disabled:opacity-60"
      >
        {busy ? "…" : "Confirm"}
      </button>
    </span>
  );
};

const BansDialog = ({
  outpost,
  myUuid,
  onClose,
}: {
  outpost: OutpostModel;
  myUuid: string;
  onClose: () => void;
}) => {
  const [items, setItems] = useState<OutpostBanItem[] | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(
    (target: number) =>
      podiumApi.getOutpostBans(outpost.uuid, target, PAGE_SIZE).then((list) => {
        const now = Date.now();
        const active = list.filter((i) => isBanActive(i, now));
        setItems((prev) => (target === 0 || !prev ? active : [...prev, ...active]));
        setPage(target);
        setHasMore(list.length === PAGE_SIZE);
      }),
    [outpost.uuid]
  );

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Removed &amp; blocked</DialogTitle>
          <DialogDescription>People the hosts took out of this outpost</DialogDescription>
        </DialogHeader>
        {items === null ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-semibold text-foreground">Nobody is blocked</p>
            <p className="mt-1 text-sm text-text-muted">
              People you remove or block from this outpost show up here.
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border/50">
              {items.map((item) => (
                <BanRow
                  key={item.user_uuid}
                  item={item}
                  outpostId={outpost.uuid}
                  myUuid={myUuid}
                  creatorUuid={outpost.creator_user_uuid}
                  onLifted={(uuid) => setItems((prev) => prev?.filter((i) => i.user_uuid !== uuid) ?? prev)}
                />
              ))}
            </ul>
            {hasMore && (
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => {
                  setLoadingMore(true);
                  loadPage(page + 1).finally(() => setLoadingMore(false));
                }}
                className="press mt-2 w-full rounded-full border border-border/60 py-2 text-sm font-semibold text-foreground disabled:opacity-60"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/** Analytics and moderation, shown only to the host and cohosts. */
export const HostTools = ({ outpost }: { outpost: OutpostModel }) => {
  const myUuid = useSelector(GlobalSelectors.podiumUserInfo)?.uuid;
  const [bansOpen, setBansOpen] = useState(false);
  if (!myUuid) return null;
  const isHost =
    outpost.creator_user_uuid === myUuid || !!outpost.cohost_user_uuids?.includes(myUuid);
  if (!isHost) return null;

  return (
    <div className="glass-card p-2">
      <p className="label-caps px-3 pb-1 pt-2">Host tools</p>
      <Link
        href={`${AppPages.outpostAnalytics(outpost.uuid)}?name=${encodeURIComponent(outpost.name)}`}
        className={rowClass}
      >
        <ToolRow
          icon={<BarChart3 className="h-4 w-4" />}
          title="Outpost analytics"
          subtitle="Listeners, retention and earnings"
        />
      </Link>
      <button type="button" className={rowClass} onClick={() => setBansOpen(true)}>
        <ToolRow
          icon={<ShieldOff className="h-4 w-4" />}
          title="Removed & blocked"
          subtitle="See who is kept out and let them back in"
        />
      </button>
      {bansOpen && (
        <BansDialog outpost={outpost} myUuid={myUuid} onClose={() => setBansOpen(false)} />
      )}
    </div>
  );
};
