"use client";

import { isLiveOutpost, isUpcomingOutpost } from "app/lib/outposts";
import { OutpostModel } from "app/services/api/types";
import { useMemo, useState } from "react";
import { EventOutpostCard } from "./EventsStrip/EventOutpostCard";

type FilterTab = "live" | "upcoming" | "all";

interface EventsListProps {
  featuredEvents: OutpostModel[];
}

export function EventsList({ featuredEvents }: EventsListProps) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    if (filter === "live") {
      return featuredEvents.filter(isLiveOutpost);
    }
    if (filter === "upcoming") {
      return featuredEvents.filter((ev) => ev.scheduled_for > now);
    }
    return featuredEvents;
  }, [featuredEvents, filter]);

  if (featuredEvents.length === 0) {
    return null;
  }

  const liveCount = featuredEvents.filter(isLiveOutpost).length;
  const upcomingCount = featuredEvents.filter((ev) =>
    isUpcomingOutpost(ev)
  ).length;

  const tabOrder: FilterTab[] = ["all", "live", "upcoming"];

  return (
    <section
      className="w-full relative"
      role="region"
      aria-label="Live and upcoming rooms"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="relative">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Live & Upcoming Rooms
          </h2>
          <div
            className="flex gap-1.5"
            role="tablist"
            aria-label="Filter events by status"
          >
            {tabOrder.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={filter === tab}
                aria-controls="events-strip"
                id={`events-tab-${tab}`}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  filter === tab
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-background text-[var(--primary)] border-[var(--border)] hover:bg-muted/50"
                }`}
              >
                {tab === "all" && `All (${featuredEvents.length})`}
                {tab === "live" && `Live (${liveCount})`}
                {tab === "upcoming" && `Upcoming (${upcomingCount})`}
              </button>
            ))}
          </div>
        </div>

        <div
          id="events-strip"
          role="tabpanel"
          aria-labelledby={`events-tab-${filter}`}
          className="flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-1 -mx-1 px-1 scroll-pl-1 scroll-pr-1"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Event list"
        >
          {filtered.map((outpost, index) => (
            <div
              key={outpost.uuid}
              className="snap-start flex-none"
              role="listitem"
            >
              <EventOutpostCard outpost={outpost} index={index} variant="strip" />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-4 text-sm text-[var(--muted-foreground)]">
            No {filter === "live" ? "live" : filter === "upcoming" ? "upcoming" : ""} rooms right now. Check back later.
          </p>
        )}
      </div>
    </section>
  );
}
