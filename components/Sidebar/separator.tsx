import { motion } from "framer-motion";

export function Separator() {
  return (
    <motion.div
      className="border-t border-border my-4"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
  );
}
