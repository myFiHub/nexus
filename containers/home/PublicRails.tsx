"use client";

import { LiveDot, Rail, RailItem, SectionHeader } from "app/components/aurora";
import { AppPages } from "app/lib/routes";
import { useVisiblePolling } from "app/lib/useVisiblePolling";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { DiscoveredOutpost, PopularTag, TrendingWindow } from "app/services/api/types";
import { Hash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CoverCard } from "./cards";

const LIVE_POLL_MS = 60_000;
const LIVE_LIMIT = 12;

const SeeAll = ({ href }: { href: string }) => (
  <Link href={href} className="text-sm font-semibold text-primary hover:underline">
    See all
  </Link>
);

const LiveNow = ({ initial }: { initial: DiscoveredOutpost[] }) => {
  const [live, setLive] = useState(initial);
  useVisiblePolling(
    () => podiumApi.getLiveOutposts(LIVE_LIMIT).then(setLive),
    LIVE_POLL_MS
  );
  if (live.length === 0) return null;
  return (
    <section>
      <SectionHeader
        title={
          <span className="inline-flex items-center gap-2">
            Live now <LiveDot />
          </span>
        }
        count={live.length}
        trailing={<SeeAll href={AppPages.allOutposts} />}
      />
      <Rail label="Live now">
        {live.map((outpost, i) => (
          <RailItem key={outpost.uuid} index={i}>
            <CoverCard outpost={outpost} stat="live" />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
};

const Trending = ({
  initial,
}: {
  initial: Record<TrendingWindow, DiscoveredOutpost[]>;
}) => {
  const [range, setRange] = useState<TrendingWindow>(
    initial["24h"].length > 0 ? "24h" : "7d"
  );
  const items = initial[range];
  if (initial["24h"].length === 0 && initial["7d"].length === 0) return null;
  return (
    <section>
      <SectionHeader
        title="Trending"
        trailing={
          <div role="tablist" aria-label="Trending window" className="flex rounded-full bg-surface-raised p-0.5">
            {(["24h", "7d"] as const).map((w) => (
              <button
                key={w}
                role="tab"
                aria-selected={range === w}
                onClick={() => setRange(w)}
                className={cn(
                  "press rounded-full px-3 py-1 text-xs font-bold transition-colors",
                  range === w ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {w === "24h" ? "Today" : "This week"}
              </button>
            ))}
          </div>
        }
      />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing trending in this window yet.</p>
      ) : (
        <Rail label="Trending" key={range}>
          {items.map((outpost, i) => (
            <RailItem key={outpost.uuid} index={i}>
              <CoverCard outpost={outpost} stat="trending" />
            </RailItem>
          ))}
        </Rail>
      )}
    </section>
  );
};

export const PopularTags = ({
  tags,
  title = "Browse by topic",
}: {
  tags: PopularTag[];
  title?: string;
}) => {
  if (tags.length === 0) return null;
  return (
    <section>
      <SectionHeader title={title} />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <Link
            key={tag.id}
            href={`${AppPages.tag(tag.id)}?name=${encodeURIComponent(tag.name)}`}
            className="animate-entrance press inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur hover:border-primary/60 hover:text-primary"
            style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
          >
            <Hash className="h-3.5 w-3.5 text-primary" />
            {tag.name}
            {tag.active_outposts_count > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--p-danger)_16%,transparent)] px-1.5 text-[10px] font-bold text-[var(--p-danger)]">
                {tag.active_outposts_count} live
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export const PublicRails = ({
  live,
  trending,
  tags,
}: {
  live: DiscoveredOutpost[];
  trending: Record<TrendingWindow, DiscoveredOutpost[]>;
  tags: PopularTag[];
}) => (
  <>
    <LiveNow initial={live} />
    <Trending initial={trending} />
    <PopularTags tags={tags} />
  </>
);
