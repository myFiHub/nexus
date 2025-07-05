import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { TriggerButtonProps } from "./types";

export function TriggerButton({
  isOpen,
  onClick,
  controls,
}: TriggerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute top-[240px] -right-4 z-50 h-8 w-8 rounded-full border-2 border-primary bg-background shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center group"
      animate={controls}
      whileHover={{
        scale: 1.1,
        rotate: isOpen ? 180 : 0,
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
