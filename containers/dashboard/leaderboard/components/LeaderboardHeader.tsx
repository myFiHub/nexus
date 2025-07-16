"use client";

import { motion } from "framer-motion";

const FloatingParticle = ({
  delay = 0,
  x = 0,
  y = 0,
}: {
  delay?: number;
  x?: number;
  y?: number;
}) => (
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

const RotatingStar = ({
  delay = 0,
  size = "w-4 h-4",
}: {
  delay?: number;
  size?: string;
}) => (
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

export const LeaderboardHeader = () => {
  return (
    <div className="relative mb-6 overflow-hidden">
      {/* Animated background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-[#23262F] via-[#181A20] to-[#23262F] opacity-80 rounded-lg z-0"
      />

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.3))",
            "linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.3), rgba(139, 92, 246, 0.3))",
            "linear-gradient(45deg, rgba(249, 115, 22, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-lg z-0"
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} x={20} y={20} />
      <FloatingParticle delay={0.5} x={80} y={40} />
      <FloatingParticle delay={1} x={60} y={80} />
      <FloatingParticle delay={1.5} x={90} y={60} />
      <FloatingParticle delay={2} x={30} y={70} />

      {/* Rotating stars - evenly distributed */}
      <motion.div
        style={{ position: "absolute", left: "5%", top: "10%", zIndex: 2 }}
      >
        <RotatingStar delay={0} size="w-6 h-6" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: "15%", top: "30%", zIndex: 2 }}
      >
        <RotatingStar delay={1} size="w-4 h-4" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", right: "10%", top: "25%", zIndex: 2 }}
      >
        <RotatingStar delay={2} size="w-5 h-5" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", left: "20%", bottom: "25%", zIndex: 2 }}
      >
        <RotatingStar delay={0.5} size="w-3 h-3" />
      </motion.div>
      <motion.div
        style={{ position: "absolute", right: "15%", bottom: "20%", zIndex: 2 }}
      >
        <RotatingStar delay={1.5} size="w-4 h-4" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 flex flex-col items-center justify-center py-12"
      >
        {/* Animated trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", delay: 0.3 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>

        {/* Main title with character animations */}
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

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2"
        >
          Leaderboard
        </motion.h1>

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex items-center gap-3"
        ></motion.div>
      </motion.div>
    </div>
  );
};
