"use client";

import { motion } from "framer-motion";

interface FloatingParticleProps {
  delay?: number;
  x?: number;
  y?: number;
}

export const FloatingParticle = ({
  delay = 0,
  x = 0,
  y = 0,
}: FloatingParticleProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [x, x + 20, x],
      y: [y, y - 30, y],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
  />
);
