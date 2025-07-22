"use client";

import { motion } from "framer-motion";
import { ImageIcon, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const sparkleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

export const NFTEmptyState = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={sparkleVariants}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400/30" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div variants={itemVariants} className="relative z-10 mb-6">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              type: "spring",
              bounce: 0.4,
            }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center"
          >
            <ImageIcon className="w-10 h-10 text-purple-400" />
          </motion.div>

          {/* Glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.2 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-xl"
          />
        </div>
      </motion.div>

      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-foreground mb-2"
      >
        No NFTs Found
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className="text-muted-foreground max-w-md leading-relaxed"
      >
        You do not have any NFTs in your wallet yet. Start collecting unique
        digital assets to see them here!
      </motion.p>

      {/* Decorative elements */}
      <motion.div variants={itemVariants} className="mt-8 flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
