"use client";
import { motion } from "framer-motion";

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

export const CurrentUserRankSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <motion.div
            className="relative w-16 h-16 bg-white/10 rounded-full overflow-hidden"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>

          <div className="flex flex-col space-y-2">
            <motion.div
              className="relative h-8 w-32 bg-white/10 rounded overflow-hidden"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
