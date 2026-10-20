"use client";

import { isLiveOutpost } from "app/lib/outposts";
import { OutpostModel } from "app/services/api/types";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { EventOutpostCard } from "./EventOutpostCard";

interface EventsStripProps {
  featuredEvents: OutpostModel[];
}

const SCROLL_AMOUNT = 180;

export function EventsStrip({ featuredEvents }: EventsStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      const delta = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      el.scrollBy({
        left: delta,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  if (featuredEvents.length === 0) {
    return null;
  }

  const liveCount = featuredEvents.filter(isLiveOutpost).length;
  const upcomingCount = featuredEvents.length - liveCount;

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      className="w-full relative"
      role="region"
      aria-label="Live and upcoming events"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }
          }
          className="mb-3 flex items-center justify-between flex-wrap gap-1.5"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-md animate-pulse" aria-hidden />
              <div className="relative w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden />
            </div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Live & Upcoming
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 dark:text-purple-400 rounded-full border border-purple-500/30">
              {featuredEvents.length} event{featuredEvents.length !== 1 ? "s" : ""}
              {liveCount > 0 && ` · ${liveCount} live`}
              {upcomingCount > 0 && ` · ${upcomingCount} upcoming`}
            </span>
          </div>
          {/* Arrow buttons: visible on larger screens when there are multiple cards */}
          {featuredEvents.length > 1 && (
            <div className="hidden sm:flex items-center gap-2" aria-label="Scroll events">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" aria-hidden />
              </button>
            </div>
          )}
        </motion.div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-0.5 -mx-1 px-1 scroll-pl-1 scroll-pr-1"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="list"
          aria-label="Event list"
        >
          {featuredEvents.map((outpost, index) => (
            <div
              key={outpost.uuid}
              className="snap-start flex-none"
              role="listitem"
            >
              <EventOutpostCard outpost={outpost} index={index} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
