import { AnimatePresence, motion } from "framer-motion";
import { SectionHeaderProps } from "./types";

export function SectionHeader({ title, isOpen, isMobile }: SectionHeaderProps) {
  return (
    <div className="w-content max-h-6 overflow-hidden">
      <AnimatePresence>
        <motion.h2
          className="text-sm font-semibold text-muted-foreground mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isOpen || isMobile ? 1 : 0, y: 0 }}
          exit={{ opacity: isOpen || isMobile ? 1 : 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
