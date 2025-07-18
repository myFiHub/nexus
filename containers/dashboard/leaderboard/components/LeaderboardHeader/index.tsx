"use client";

import { motion } from "framer-motion";
import { AnimatedTitle } from "./AnimatedTitle";
import { AnimatedTrophy } from "./AnimatedTrophy";
import { BackgroundEffects } from "./BackgroundEffects";

export const LeaderboardHeader = () => {
  return (
    <div className="relative mb-6 overflow-hidden">
      <BackgroundEffects />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 flex flex-col items-center justify-center py-12"
      >
        <AnimatedTrophy />
        <AnimatedTitle />

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2"
        >
          Leaderboard
        </motion.h1>

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex items-center gap-3"
        ></motion.div>
      </motion.div>
    </div>
  );
};
