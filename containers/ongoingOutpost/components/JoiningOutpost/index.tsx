"use client";

import { motion } from "framer-motion";

export const JoiningOutpost = () => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[60vh] min-w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
        />
        <p className="text-lg font-medium text-foreground">
          Joining outpost...
        </p>
      </div>
    </motion.div>
  );
};
