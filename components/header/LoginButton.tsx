"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useIsMobile } from "app/hooks/use-mobile";
import { CookieKeys, getClientCookie } from "app/lib/client-cookies";
import { AppPages } from "app/lib/routes";
import { cn, truncate } from "app/lib/utils";
import { BarChart3, ChevronDown, Crown, Loader2, LogIn, LogOut, User } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppLink } from "../AppLink";
import BalanceDisplay from "../BalanceDisplay";
import { logoutDialog } from "../Dialog";
import { Img } from "../Img";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

interface LoginButtonProps {
  size?: "sm" | "lg";
  className?: string;
  /** Kept for call-site compatibility; the header uses the default style. */
  fancy?: boolean;
}

const noopSubscribe = () => () => {};

/** A saved session cookie means the pending state is a session restore, not a fresh login. */
const useHasSavedSession = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => !!getClientCookie(CookieKeys.myUserId),
    () => false
  );

const chipBase =
  "press inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[box-shadow,filter,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed";

export const LoginButton = ({ size, className }: LoginButtonProps) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const podiumUserInfo = useSelector(GlobalSelectors.podiumUserInfo);
  const initializingWeb3Auth = useSelector(GlobalSelectors.initializingWeb3Auth);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const logingOut = useSelector(GlobalSelectors.logingOut);
  const isPrimary = useSelector(GlobalSelectors.isPrimaryAccount);
  const isMobile = useIsMobile();
  const hasSavedSession = useHasSavedSession();
  const loading = Boolean(logingIn || logingOut || initializingWeb3Auth);
  const height = size === "sm" ? "h-8" : "h-10";

  const connect = () => {
    dispatch(isMobile ? globalActions.socialLogin() : globalActions.login());
  };

  const disconnect = async () => {
    const result = await logoutDialog();
    if (result) {
      dispatch(globalActions.logout());
    }
  };

  if (isLoggedIn && podiumUserInfo?.aptos_address) {
    return (
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={loading}
              aria-label="Account menu"
              className={cn(
                chipBase,
                height,
                "group glass-card !rounded-full pl-1 pr-3 text-foreground hover:bg-surface-raised",
                className
              )}
            >
              <span className="rounded-full bg-grad-aurora p-[2px]">
                <span className="block h-7 w-7 overflow-hidden rounded-full bg-surface">
                  {loading ? (
                    <Loader2 className="m-1.5 h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Img
                      src={podiumUserInfo.image || ""}
                      alt={podiumUserInfo.name ?? podiumUserInfo.aptos_address}
                      className="h-full w-full object-cover"
                      useImgTag
                    />
                  )}
                </span>
              </span>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="max-w-[120px] truncate text-xs font-semibold">
                  {podiumUserInfo.name || truncate(podiumUserInfo.aptos_address)}
                </span>
                <BalanceDisplay className="text-[10px] font-medium text-muted-foreground" />
              </span>
              <ChevronDown className="h-4 w-4 text-text-faint transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-60 rounded-[18px] p-1.5" align="end" sideOffset={8}>
            <div className="border-b border-border px-3 pb-2 pt-1.5">
              <p className="truncate text-sm font-semibold text-foreground">
                {podiumUserInfo.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{podiumUserInfo.login_type}</p>
              <p className="text-xs text-text-faint tabular-nums">
                {truncate(podiumUserInfo.aptos_address, 20)}
              </p>
            </div>
            <AppLink
              href={AppPages.profile}
              underline={false}
              className="mt-1 flex h-auto w-full items-center justify-start gap-3 rounded-[12px] px-3 py-2 text-sm text-foreground hover:bg-accent"
            >
              <User className="h-4 w-4" />
              Profile
            </AppLink>
            <AppLink
              href={AppPages.analytics}
              underline={false}
              className="flex h-auto w-full items-center justify-start gap-3 rounded-[12px] px-3 py-2 text-sm text-foreground hover:bg-accent"
            >
              <BarChart3 className="h-4 w-4" />
              Host dashboard
            </AppLink>
            <button
              type="button"
              onClick={disconnect}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-sm text-[var(--p-danger)] hover:bg-[color-mix(in_oklab,var(--p-danger)_12%,transparent)]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </PopoverContent>
        </Popover>

        {!loading && (
          <span className="pointer-events-none absolute -right-1 -top-1">
            {isPrimary ? (
              <Crown
                className="h-4 w-4 text-[var(--p-warning)]"
                fill="currentColor"
                aria-label="Primary account"
              />
            ) : (
              <span className="rounded bg-[var(--p-danger)] px-1 text-[8px] font-bold text-white">
                Not primary
              </span>
            )}
          </span>
        )}
      </div>
    );
  }

  const restoring = loading;
  const label = loading && (hasSavedSession || logingIn) ? "Signing in" : "Log in";

  return (
    <button
      type="button"
      onClick={connect}
      disabled={restoring}
      aria-busy={restoring}
      className={cn(
        chipBase,
        height,
        "px-4",
        restoring
          ? "glass-card !rounded-full text-muted-foreground"
          : "btn-aurora !rounded-full hover:shadow-[0_8px_28px_-8px_color-mix(in_oklab,var(--p-accent)_70%,transparent)]",
        className
      )}
    >
      {restoring ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      {label}
    </button>
  );
};
