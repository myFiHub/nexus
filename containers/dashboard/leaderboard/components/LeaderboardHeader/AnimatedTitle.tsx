"use client";

import { motion } from "framer-motion";

export const AnimatedTitle = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {["P", "o", "d", "i", "u", "m"].map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + index * 0.1,
            type: "spring",
          }}
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};
