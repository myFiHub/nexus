"use client";

import { GlassCard, IconTile, Skeleton, Tone } from "app/components/aurora";
import { cn } from "app/lib/utils";
import {
  AnalyticsWindow,
  AudienceSlot,
  EarningsByChain,
  HostAnalyticsDay,
  HostAnalyticsTotals,
  RetentionPoint,
} from "app/services/api/types";
import {
  ArrowLeft,
  Clock3,
  Headphones,
  Radio,
  RefreshCw,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
import {
  ANALYTICS_WINDOWS,
  chainInfo,
  DAY_NAMES,
  formatAmount,
  formatCount,
  formatDayDate,
  formatEarned,
  formatHour,
  formatMinutes,
  formatPercent,
  formatShortDate,
  formatSlot,
  parseDay,
} from "./format";

export const AnalyticsHeader = ({
  title,
  subtitle,
  backHref,
  window,
  onWindowChange,
  refreshing,
  onRefresh,
}: {
  title: ReactNode;
  subtitle: string;
  backHref?: string;
  window: AnalyticsWindow;
  onWindowChange: (window: AnalyticsWindow) => void;
  refreshing: boolean;
  onRefresh?: () => void;
}) => (
  <header className="animate-entrance flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex min-w-0 items-start gap-3">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Back"
          className="press mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
      <div className="min-w-0">
        <p className="label-caps">{subtitle}</p>
        <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <WindowPicker value={window} onChange={onWindowChange} />
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh"
          className="press inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-text-muted transition-colors hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </button>
      )}
    </div>
  </header>
);

const WindowPicker = ({
  value,
  onChange,
}: {
  value: AnalyticsWindow;
  onChange: (window: AnalyticsWindow) => void;
}) => (
  <div
    role="radiogroup"
    aria-label="Time range"
    className="inline-flex rounded-full border border-border/60 bg-surface/60 p-1"
  >
    {ANALYTICS_WINDOWS.map(({ id, label }) => {
      const selected = id === value;
      return (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            selected
              ? "bg-grad-primary text-[var(--p-on-accent)]"
              : "text-text-muted hover:text-foreground"
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const Section = ({
  title,
  subtitle,
  children,
  className,
  index = 0,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  index?: number;
}) => (
  <GlassCard
    className={cn("animate-entrance p-5", className)}
    style={{ "--i": index } as CSSProperties}
  >
    <h2 className="font-semibold text-foreground">{title}</h2>
    {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </GlassCard>
);

export const Muted = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-text-muted">{children}</p>
);

const KpiTile = ({
  icon,
  tone,
  label,
  value,
  detail,
  index,
}: {
  icon: ReactNode;
  tone: Tone;
  label: string;
  value: string;
  detail: string;
  index: number;
}) => (
  <GlassCard className="animate-entrance p-4" style={{ "--i": index } as CSSProperties}>
    <div className="flex items-center gap-2">
      <IconTile tone={tone} size={28}>
        {icon}
      </IconTile>
      <span className="truncate text-xs font-medium text-text-muted">{label}</span>
    </div>
    <p className="mt-3 truncate text-2xl font-bold tracking-tight text-foreground tabular-nums">
      {value}
    </p>
    <p className="mt-0.5 truncate text-xs text-text-faint">{detail}</p>
  </GlassCard>
);

export const KpiGrid = ({
  totals,
  earnedChainId,
}: {
  totals: HostAnalyticsTotals;
  earnedChainId: string;
}) => {
  const tiles = [
    {
      icon: <Users className="h-4 w-4" />,
      tone: "danger" as Tone,
      label: "Peak listeners",
      value: formatCount(totals.peak_listeners),
      detail: `avg ${totals.avg_peak_listeners.toFixed(1)} per session`,
    },
    {
      icon: <UserPlus className="h-4 w-4" />,
      tone: "accent" as Tone,
      label: "Unique listeners",
      value: formatCount(totals.unique_listeners),
      detail: `${formatCount(totals.returning_listeners)} came back`,
    },
    {
      icon: <Headphones className="h-4 w-4" />,
      tone: "violet" as Tone,
      label: "Listening time",
      value: formatMinutes(totals.listen_minutes),
      detail: `${formatMinutes(totals.avg_listen_minutes)} per visit`,
    },
    {
      icon: <Clock3 className="h-4 w-4" />,
      tone: "success" as Tone,
      label: "Stayed 10+ min",
      value: formatPercent(totals.retention_10min_rate),
      detail: `${formatCount(totals.listener_visits)} visits`,
    },
    {
      icon: <Radio className="h-4 w-4" />,
      tone: "magenta" as Tone,
      label: "Sessions",
      value: formatCount(totals.sessions),
      detail: `${formatMinutes(totals.hosted_minutes)} hosted`,
    },
    {
      icon: <Wallet className="h-4 w-4" />,
      tone: "warning" as Tone,
      label: "Earned",
      value: formatEarned(totals.earned, earnedChainId),
      detail: `${formatCount(totals.cheers)} cheers · ${formatCount(totals.boos)} boos`,
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {tiles.map((tile, i) => (
        <KpiTile key={tile.label} index={i} {...tile} />
      ))}
    </div>
  );
};

/** Listener visits per day, with the busiest day highlighted. */
export const DailyChart = ({ points }: { points: HostAnalyticsDay[] }) => {
  if (points.length === 0) return <Muted>No sessions in this period</Muted>;
  const max = Math.max(...points.map((p) => p.listener_visits));
  const best = points.reduce((a, b) => (b.listener_visits > a.listener_visits ? b : a));
  const gap = points.length > 45 ? "gap-px" : "gap-1";
  return (
    <div>
      <div className={cn("flex h-32 items-end", gap)} role="img" aria-label="Listener visits per day">
        {points.map((p) => {
          const height = max > 0 && p.listener_visits > 0 ? Math.max(3, (p.listener_visits / max) * 100) : 0;
          const label = `${formatDayDate(parseDay(p.date))}: ${p.listener_visits} visits, peak ${p.peak_listeners}`;
          return (
            <div
              key={p.date}
              title={label}
              className="relative h-full min-w-0 flex-1 overflow-hidden rounded-[4px] bg-surface-raised/60"
            >
              {height > 0 && (
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 rounded-[4px] transition-[height] duration-500",
                    p === best ? "bg-grad-primary" : "bg-[color-mix(in_oklab,var(--p-accent)_55%,transparent)]"
                  )}
                  style={{ height: `${height}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-text-faint">
        <span>{formatShortDate(parseDay(points[0].date))}</span>
        <span>{formatShortDate(parseDay(points[points.length - 1].date))}</span>
      </div>
      {best.listener_visits > 0 && (
        <p className="mt-3 text-xs text-foreground">
          Best day: {formatDayDate(parseDay(best.date))} · {best.listener_visits} listener visits,
          peak {best.peak_listeners}
        </p>
      )}
    </div>
  );
};

/** Share of listener visits still there after each mark. */
export const RetentionBars = ({ points }: { points: RetentionPoint[] }) => {
  const shown = points.filter((p) => p.minute > 0);
  if (shown.length === 0 || points.every((p) => p.listeners === 0)) {
    return <Muted>No listeners yet</Muted>;
  }
  return (
    <ul className="space-y-2.5">
      {shown.map((p) => {
        const share = Math.min(Math.max(p.share, 0), 1);
        return (
          <li key={p.minute} className="flex items-center gap-3 text-xs">
            <span className="w-14 shrink-0 text-text-muted">{p.minute}+ min</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-raised/70">
              <span
                className="block h-full rounded-full bg-grad-primary transition-[width] duration-500"
                style={{ width: `${share * 100}%` }}
              />
            </span>
            <span className="w-10 shrink-0 text-right font-semibold text-foreground tabular-nums">
              {formatPercent(share)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/** Top slots plus a day-by-hour heatmap of when the audience listens. */
export const BestTime = ({
  cells,
  bestSlots,
}: {
  cells: AudienceSlot[];
  bestSlots: AudienceSlot[];
}) => {
  const grid = DAY_NAMES.map(() => HOURS.map(() => 0));
  for (const c of cells) {
    if (c.dow >= 0 && c.dow < 7 && c.hour >= 0 && c.hour < 24) grid[c.dow][c.hour] += c.users;
  }
  const max = Math.max(0, ...grid.flat());
  if (max === 0) {
    return <Muted>Not enough listening data yet. Host a few sessions and check back.</Muted>;
  }
  const top = bestSlots.slice(0, 3);
  return (
    <div className="space-y-4">
      {top.length > 0 && (
        <ol className="flex flex-wrap gap-2">
          {top.map((slot, i) => (
            <li
              key={`${slot.dow}-${slot.hour}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                i === 0
                  ? "bg-grad-primary text-[var(--p-on-accent)]"
                  : "border border-border/60 text-foreground"
              )}
            >
              <span className="tabular-nums opacity-70">#{i + 1}</span>
              {formatSlot(slot)}
              <span className="font-normal opacity-70">
                {formatCount(slot.users)} {slot.users === 1 ? "person" : "people"}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="overflow-x-auto invisible-scrollbar">
        <div className="min-w-[420px]">
          {grid.map((row, dow) => (
            <div key={dow} className="mb-[3px] flex items-center gap-2">
              <span className="w-8 shrink-0 text-[11px] text-text-faint">{DAY_NAMES[dow]}</span>
              <div className="grid flex-1 grid-cols-24 gap-[3px]">
                {row.map((users, hour) => {
                  const strength = users / max;
                  return (
                    <span
                      key={hour}
                      title={`${DAY_NAMES[dow]} ${formatHour(hour)}: ${users} ${users === 1 ? "person" : "people"}`}
                      className="aspect-square rounded-[3px]"
                      style={{
                        background:
                          users > 0
                            ? `color-mix(in oklab, var(--p-accent) ${Math.round(18 + strength * 82)}%, var(--p-surface-raised))`
                            : "color-mix(in oklab, var(--p-surface-raised) 70%, transparent)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-1 flex gap-2 pl-10 text-[11px] text-text-faint">
            <div className="grid flex-1 grid-cols-4">
              {[0, 6, 12, 18].map((h) => (
                <span key={h}>{formatHour(h)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EarningsList = ({ items }: { items: EarningsByChain[] }) => {
  const earning = items.filter((i) => i.total_amount > 0 || i.cheers > 0 || i.boos > 0);
  if (earning.length === 0) return <Muted>Nothing yet</Muted>;
  return (
    <ul className="divide-y divide-border/50">
      {earning.map((item) => {
        const chain = chainInfo(item.chain_id);
        return (
          <li key={item.chain_id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <IconTile tone="warning" size={32}>
              <Wallet className="h-4 w-4" />
            </IconTile>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{chain.name}</p>
              <p className="truncate text-xs text-text-muted">
                {item.cheers} cheers · {item.boos} boos
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-[var(--p-success)] tabular-nums">
              {formatAmount(item.total_amount, chain.currency)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export const EarnedValue = ({ amount, chainId }: { amount: number; chainId: string }) => (
  <span
    className={cn(
      "text-sm font-bold tabular-nums",
      amount > 0 ? "text-[var(--p-success)]" : "text-text-faint"
    )}
  >
    {formatEarned(amount, chainId)}
  </span>
);

export const pillLinkClass =
  "btn-aurora press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--p-on-accent)]";

export const AnalyticsState = ({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message?: ReactNode;
  action?: ReactNode;
}) => (
  <GlassCard className="animate-entrance mx-auto mt-6 flex max-w-md flex-col items-center p-8 text-center">
    <IconTile size={48}>{icon}</IconTile>
    <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
    {message && <p className="mt-1 text-sm text-text-muted">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </GlassCard>
);

export const AnalyticsSkeleton = ({ showBestTime }: { showBestTime?: boolean }) => (
  <div className="animate-crossfade space-y-4" aria-busy="true" aria-label="Loading analytics">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-[116px] rounded-[18px]" />
      ))}
    </div>
    <Skeleton className="h-56 rounded-[18px]" />
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-48 rounded-[18px]" />
      <Skeleton className="h-48 rounded-[18px]" />
    </div>
    {showBestTime && <Skeleton className="h-64 rounded-[18px]" />}
  </div>
);
