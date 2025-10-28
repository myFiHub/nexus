"use client";

import { motion } from "framer-motion";

export const CohostsEmptyState = () => {
  return (
    <motion.div
      key="empty-state"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg"
    >
      No cohosts added yet. Click the + button to add cohosts.
    </motion.div>
  );
};
