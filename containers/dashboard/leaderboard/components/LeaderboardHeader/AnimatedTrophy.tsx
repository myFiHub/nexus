"use client";

import { motion } from "framer-motion";
import { AnimatedNumberOne } from "../animatedRank/first";
import { AnimatedNumberTwo } from "../animatedRank/second";
import { AnimatedNumberThree } from "../animatedRank/third";

export const AnimatedTrophy = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, type: "spring", delay: 0.3 }}
      className="text-6xl mb-4 flex flex-col items-center"
    >
      <motion.div
        className="flex flex-col items-center mb-2"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatedNumberOne />
      </motion.div>
      <div className="flex items-center gap-2">
        <motion.div
          className="flex flex-col items-center -mt-10"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          }}
        >
          <div className="w-16 h-16">
            <AnimatedNumberTwo />
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col items-center -mt-4"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.3,
          }}
        >
          <div className="w-16 h-16">
            <AnimatedNumberThree />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
