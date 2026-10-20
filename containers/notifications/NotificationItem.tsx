"use client";

import { Img } from "app/components/Img";
import { usersSelectors } from "app/containers/_users/selectors";
import { usersActions, injectUsersSlice } from "app/containers/_users/slice";
import { useClock } from "app/lib/clock";
import { logoUrl } from "app/lib/constants";
import { agoLabel } from "app/lib/format";
import { AppPages } from "app/lib/routes";
import { toast } from "app/lib/toast";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { NotificationModel } from "app/services/api/types";
import { Check, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notificationsActions } from "./slice";

const iconButton =
  "inline-flex h-7 w-7 items-center justify-center rounded-full text-text-faint transition-colors hover:bg-surface-raised hover:text-foreground";

const Ago = ({ seconds }: { seconds: number }) => {
  const label = useClock((now) => (now === null ? null : agoLabel(seconds * 1000, now)), 60_000);
  if (!label) return null;
  return <p className="mt-1 text-[11px] text-text-faint">{label}</p>;
};

const FollowBack = ({ uuid }: { uuid: string }) => {
  injectUsersSlice();
  const dispatch = useDispatch();
  const followed = useSelector(usersSelectors.isFollowedFromCache(uuid));
  if (followed) {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--p-success)]">
        <Check className="h-3 w-3" />
        Following
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={() => dispatch(usersActions.followUnfollowUser({ id: uuid, follow: true, noRouterRefresh: true }))}
      className="press mt-2 rounded-full border border-[color-mix(in_oklab,var(--p-accent)_45%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--p-accent)] hover:bg-[color-mix(in_oklab,var(--p-accent)_10%,transparent)]"
    >
      Follow back
    </button>
  );
};

export const NotificationItem = ({
  notification,
  onNavigate,
}: {
  notification: NotificationModel;
  onNavigate?: () => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "reject" | null>(null);
  const follow = notification.notification_type === "follow" ? notification.follow_metadata : undefined;
  const invite = notification.notification_type === "invite" ? notification.invite_metadata : undefined;

  const markRead = () => {
    if (!notification.is_read) dispatch(notificationsActions.markNotificationAsRead(notification.uuid));
  };
  const remove = () => dispatch(notificationsActions.deleteNotification(notification.uuid));

  const accept = async () => {
    if (!invite) return;
    setBusy("accept");
    const ok = await podiumApi.addMeAsMember(invite.outpost_uuid, invite.inviter_uuid);
    setBusy(null);
    if (!ok) {
      toast.error("Couldn't accept the invitation");
      return;
    }
    remove();
    onNavigate?.();
    router.push(AppPages.outpostDetails(invite.outpost_uuid));
  };

  const reject = async () => {
    if (!invite) return;
    setBusy("reject");
    const ok = await podiumApi.rejectInvitation({
      inviter_uuid: invite.inviter_uuid,
      outpost_uuid: invite.outpost_uuid,
    });
    setBusy(null);
    if (ok) {
      toast.success("Invitation rejected");
      remove();
    } else {
      toast.error("Failed to reject invitation");
    }
  };

  const personUuid = follow?.follower_uuid ?? invite?.inviter_uuid;
  const image = follow?.follower_image || invite?.inviter_image || logoUrl;
  const name = follow?.follower_name || invite?.inviter_name || "Someone";

  let title = "Notification";
  let body = <>{notification.message}</>;
  if (follow) {
    title = "New follower";
    body = (
      <>
        <span className="font-semibold text-foreground">{name}</span> started following you
      </>
    );
  } else if (invite) {
    title = "Outpost invitation";
    body = (
      <>
        <span className="font-semibold text-foreground">{name}</span> invited you to{" "}
        {invite.action === "speak" ? "speak in" : "join"}{" "}
        <Link
          href={AppPages.outpostDetails(invite.outpost_uuid)}
          onClick={() => {
            markRead();
            onNavigate?.();
          }}
          className="font-semibold text-[var(--p-accent)] hover:underline"
        >
          {invite.outpost_name}
        </Link>
      </>
    );
  }

  const avatar = (
    <span className="block h-9 w-9 overflow-hidden rounded-full bg-surface-raised">
      <Img src={image} alt={name} width={36} height={36} useImgTag className="h-full w-full object-cover" />
    </span>
  );

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 px-3 py-3 transition-colors hover:bg-surface-raised/40",
        !notification.is_read && "bg-[color-mix(in_oklab,var(--p-accent)_7%,transparent)]"
      )}
    >
      {!notification.is_read && (
        <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--p-accent)]" />
      )}
      {personUuid ? (
        <Link
          href={AppPages.userDetails(personUuid)}
          onClick={() => {
            markRead();
            onNavigate?.();
          }}
          className="shrink-0"
        >
          {avatar}
        </Link>
      ) : (
        <span className="shrink-0">{avatar}</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="label-caps !text-[10px]">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{body}</p>
            <Ago seconds={notification.created_at} />
          </div>
          <div className="flex shrink-0 items-center">
            {!notification.is_read && (
              <button type="button" onClick={markRead} aria-label="Mark as read" className={iconButton}>
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={remove}
              aria-label="Delete notification"
              className={cn(iconButton, "hover:text-[var(--p-danger)]")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {invite && (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={accept}
              disabled={busy !== null}
              className="btn-aurora press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--p-on-accent)] disabled:opacity-60"
            >
              {busy === "accept" && <Loader2 className="h-3 w-3 animate-spin" />}
              Accept
            </button>
            <button
              type="button"
              onClick={reject}
              disabled={busy !== null}
              className="press inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-60"
            >
              {busy === "reject" && <Loader2 className="h-3 w-3 animate-spin" />}
              Reject
            </button>
          </div>
        )}
        {follow && <FollowBack uuid={follow.follower_uuid} />}
      </div>
    </div>
  );
};
