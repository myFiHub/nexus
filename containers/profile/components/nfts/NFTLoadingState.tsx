"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    variants={skeletonVariants}
    className="relative bg-card/50 border border-border/30 rounded-2xl overflow-hidden"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Image skeleton */}
    <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>

    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <div className="h-4 bg-muted/50 rounded-full w-3/4 relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
        <div className="h-3 bg-muted/30 rounded-full w-1/2 relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const NFTLoadingState = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header skeleton */}
      <motion.div
        variants={skeletonVariants}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <div className="h-8 bg-muted/50 rounded-lg w-32 relative overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
          <div className="h-4 bg-muted/30 rounded-lg w-48 relative overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </div>
        </div>

        {/* Refresh button skeleton */}
        <div className="w-12 h-12 bg-muted/30 rounded-full relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      </motion.div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <SkeletonCard key={index} index={index} />
        ))}
      </div>
    </motion.div>
  );
};
