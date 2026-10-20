"use client";

import { OutpostThumb } from "app/components/aurora";
import { AppPages } from "app/lib/routes";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { AudienceSource, HostAnalyticsSummary, HostOutpostStat } from "app/services/api/types";
import { BarChart3, ChevronRight, Plus, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { formatCount, formatPercent } from "./format";
import { SessionGate } from "./SessionGate";
import { AnalyticsLoader, useWindowedAnalytics } from "./useWindowedAnalytics";
import {
  AnalyticsHeader,
  AnalyticsSkeleton,
  AnalyticsState,
  BestTime,
  DailyChart,
  EarnedValue,
  EarningsList,
  KpiGrid,
  Muted,
  pillLinkClass,
  RetentionBars,
  Section,
} from "./widgets";

const audienceSubtitle: Record<AudienceSource, string> = {
  followers: "When your followers are listening, in your local time",
  listeners: "When your listeners usually join, in your local time",
  none: "In your local time",
};

const TopOutposts = ({
  items,
  earnedChainId,
}: {
  items: HostOutpostStat[];
  earnedChainId: string;
}) => {
  if (items.length === 0) return <Muted>No sessions in this period</Muted>;
  return (
    <ul className="-mx-2 divide-y divide-border/50">
      {items.map((item) => (
        <li key={item.uuid}>
          <Link
            href={`${AppPages.outpostAnalytics(item.uuid)}?name=${encodeURIComponent(item.name)}`}
            className="press flex items-center gap-3 rounded-[14px] px-2 py-3 transition-colors hover:bg-surface-raised/50"
          >
            <OutpostThumb image={item.image} name={item.name} size={44} />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-semibold",
                  item.is_archived ? "text-text-faint" : "text-foreground"
                )}
              >
                {item.name}
              </p>
              <p className="truncate text-xs text-text-muted">
                {item.sessions} sessions · {formatCount(item.unique_listeners)} listeners · peak{" "}
                {item.peak_listeners} · {formatPercent(item.retention_10min_rate)} stayed 10m
              </p>
            </div>
            <EarnedValue amount={item.earned} chainId={earnedChainId} />
            <ChevronRight className="h-4 w-4 shrink-0 text-text-faint" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Dashboard = () => {
  const load = useCallback<AnalyticsLoader<HostAnalyticsSummary>>(
    (window, offset) => podiumApi.getHostAnalyticsSummary(window, offset),
    []
  );
  const { window, setWindow, data, error, loading, refreshing, refresh } = useWindowedAnalytics(
    load,
    true
  );

  const header = (
    <AnalyticsHeader
      title="Host dashboard"
      subtitle="How your outposts are doing"
      window={window}
      onWindowChange={setWindow}
      refreshing={refreshing || loading}
      onRefresh={refresh}
    />
  );

  let body;
  if (!data) {
    body = error ? (
      <AnalyticsState
        icon={<TriangleAlert className="h-6 w-6" />}
        title="Couldn't load your analytics"
        message={error}
        action={
          <button type="button" onClick={refresh} disabled={refreshing} className={pillLinkClass}>
            Try again
          </button>
        }
      />
    ) : (
      <AnalyticsSkeleton showBestTime />
    );
  } else if (data.outposts_count === 0) {
    body = (
      <AnalyticsState
        icon={<BarChart3 className="h-6 w-6" />}
        title="Host your first outpost"
        message="Your audience, retention and earnings show up here once people join your sessions."
        action={
          <Link href={AppPages.createOutpost} className={pillLinkClass}>
            <Plus className="h-4 w-4" />
            Start an outpost
          </Link>
        }
      />
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
          title="Best time to go live"
          subtitle={audienceSubtitle[data.audience_source] ?? audienceSubtitle.none}
          index={4}
        >
          <BestTime cells={data.audience_heatmap} bestSlots={data.best_slots} />
        </Section>
        <Section title="Your outposts" subtitle="Ranked by listeners in this period" index={5}>
          <TopOutposts items={data.top_outposts} earnedChainId={data.earned_chain_id} />
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

export const HostDashboard = () => (
  <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
    <SessionGate skeleton={<AnalyticsSkeleton showBestTime />}>
      {(user) => <Dashboard key={user.uuid} />}
    </SessionGate>
  </div>
);
