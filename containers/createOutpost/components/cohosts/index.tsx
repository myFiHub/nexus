"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CohostsHeader } from "./CohostsHeader";
import { CohostsList } from "./CohostsList";
import { CohostsDialogProvider } from "./dialog";

export const Cohosts = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      <CohostsDialogProvider />
      <div className="space-y-2">
        <CohostsHeader isExpanded={isExpanded} onToggle={toggleExpanded} />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CohostsList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
