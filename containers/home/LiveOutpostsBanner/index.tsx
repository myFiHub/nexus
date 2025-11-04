"use client";

import { OutpostModel } from "app/services/api/types";
import { motion } from "framer-motion";
import { LiveOutpostCard } from "./LiveOutpostCard";

interface LiveOutpostsBannerProps {
  liveOutposts: OutpostModel[];
}

export const LiveOutpostsBanner = ({
  liveOutposts,
}: LiveOutpostsBannerProps) => {
  // Limit to max 5 outposts
  const displayedOutposts = liveOutposts.slice(0, 5);

  if (displayedOutposts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="relative overflow-hidden">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-md animate-pulse" />
              <div className="relative w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Live Now
            </h2>
            <span className="px-3 py-1 text-sm font-semibold bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              {displayedOutposts.length} Active
            </span>
          </div>
        </motion.div>

        {/* Outposts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 px-1">
          {displayedOutposts.map((outpost, index) => (
            <LiveOutpostCard
              key={outpost.uuid}
              outpost={outpost}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
