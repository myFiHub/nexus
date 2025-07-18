"use client";

import { motion } from "framer-motion";

interface RotatingStarProps {
  delay?: number;
  size?: string;
}

export const RotatingStar = ({
  delay = 0,
  size = "w-4 h-4",
}: RotatingStarProps) => (
  <motion.div
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
    className={`${size} text-yellow-300`}
  >
    ⭐
  </motion.div>
);
