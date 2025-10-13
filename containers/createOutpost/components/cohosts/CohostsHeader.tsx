"use client";

import { Button } from "app/components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PlusIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { createOutpostSelectors } from "../../selectors";
import { cohostsDialog } from "./dialog";

interface CohostsHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
 }

export const CohostsHeader = ({
  isExpanded,
  onToggle,
 }: CohostsHeaderProps) => {
  const cohostUsers = useSelector(createOutpostSelectors.cohostUsers) || [];
  const cohostCount = cohostUsers.length;

  const handleOpenDialog = async () => {
    await cohostsDialog({
      title: "Select Cohosts",
    });
  };


  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors cursor-pointer">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 text-left"
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">Cohosts</span>
          <AnimatePresence mode="wait">
            {cohostCount > 0 && (
              <motion.span
                key={cohostCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="ml-1 px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full"
              >
                {cohostCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </button>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenDialog}
          className="h-8"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <PlusIcon className="w-4 h-4" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};
