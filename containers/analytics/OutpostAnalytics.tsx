"use client";

import { AppPages } from "app/lib/routes";
import podiumApi from "app/services/api";
import { HostOutpostAnalytics, HostSessionStat } from "app/services/api/types";
import { Lock, SearchX, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { formatMinutes, formatPercent, formatSessionDate } from "./format";
import { SessionGate } from "./SessionGate";
import { AnalyticsLoader, useWindowedAnalytics } from "./useWindowedAnalytics";
import {
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsState,
  DailyChart,
  EarnedValue,
  EarningsList,
  KpiGrid,
  Muted,
  pillLinkClass,
  RetentionBars,
  Section,
} from "./widgets";

const Sessions = ({
  items,
  earnedChainId,
}: {
  items: HostSessionStat[];
  earnedChainId: string;
}) => {
  if (items.length === 0) return <Muted>No sessions with listeners in this period</Muted>;
  return (
    <ul className="divide-y divide-border/50">
      {items.map((s) => (
        <li key={s.uuid} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{formatSessionDate(s.started_at)}</p>
            <p className="text-xs text-text-muted">
              {formatMinutes(s.duration_seconds / 60)} · {s.listeners} listeners · peak{" "}
              {s.peak_listeners} · {formatPercent(s.retention_10min_rate)} stayed 10m
            </p>
          </div>
          <div className="shrink-0 text-right">
            <EarnedValue amount={s.earned} chainId={earnedChainId} />
            <p className="text-[11px] text-text-faint">
              {s.cheers} cheers · {s.boos} boos
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Analytics = ({ outpostId, initialName }: { outpostId: string; initialName?: string }) => {
  const load = useCallback<AnalyticsLoader<HostOutpostAnalytics>>(
    (window, offset) => podiumApi.getHostOutpostAnalytics(outpostId, window, offset),
    [outpostId]
  );
  const { window, setWindow, data, error, status, loading, refreshing, refresh } =
    useWindowedAnalytics(load, true);

  const denied = !data && (status === 403 || status === 404);
  const name = data?.outpost.name || initialName;

  const header = (
    <AnalyticsHeader
      title={name || "Outpost analytics"}
      subtitle="Outpost analytics"
      backHref={AppPages.analytics}
      window={window}
      onWindowChange={setWindow}
      refreshing={refreshing || loading}
      onRefresh={denied ? undefined : refresh}
    />
  );

  let body;
  if (status === 403 && !data) {
    body = (
      <AnalyticsState
        icon={<Lock className="h-6 w-6" />}
        title="These numbers are private"
        message="Only the host and cohosts can see these numbers."
        action={
          <Link href={AppPages.outpostDetails(outpostId)} className={pillLinkClass}>
            View outpost
          </Link>
        }
      />
    );
  } else if (status === 404 && !data) {
    body = (
      <AnalyticsState
        icon={<SearchX className="h-6 w-6" />}
        title="Outpost not found"
        message="It may have been removed."
        action={
          <Link href={AppPages.analytics} className={pillLinkClass}>
            Back to dashboard
          </Link>
        }
      />
    );
  } else if (!data) {
    body = error ? (
      <AnalyticsState
        icon={<TriangleAlert className="h-6 w-6" />}
        title="Couldn't load analytics"
        message={error}
        action={
          <button type="button" onClick={refresh} disabled={refreshing} className={pillLinkClass}>
            Try again
          </button>
        }
      />
    ) : (
      <AnalyticsSkeleton />
    );
  } else {
    body = (
      <div key={window} className="animate-crossfade space-y-4">
        <KpiGrid totals={data.totals} earnedChainId={data.earned_chain_id} />
        <Section title="Daily listeners" subtitle="Listener visits per day" index={1}>
          <DailyChart points={data.daily} />
        </Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <Section
            title="Retention"
            subtitle="Share of listener visits that lasted at least"
            index={2}
          >
            <RetentionBars points={data.retention_curve} />
          </Section>
          <Section title="Earnings" subtitle="Cheers and boos received, after fees" index={3}>
            <EarningsList items={data.earnings_by_chain} />
          </Section>
        </div>
        <Section
          title="Sessions"
          subtitle={data.sessions.length > 0 ? "Newest first" : undefined}
          index={4}
        >
          <Sessions items={data.sessions} earnedChainId={data.earned_chain_id} />
        </Section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      {body}
    </div>
  );
};

export const OutpostAnalytics = ({
  outpostId,
  initialName,
}: {
  outpostId: string;
  initialName?: string;
}) => (
  <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
    <SessionGate skeleton={<AnalyticsSkeleton />}>
      {(user) => (
        <Analytics key={`${user.uuid}:${outpostId}`} outpostId={outpostId} initialName={initialName} />
      )}
    </SessionGate>
  </div>
);
