import { motion } from "framer-motion";

export const Sparkles = () => {
  return (
    <>
      {/* Side sparkles */}
      <motion.div
        className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.33, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-300 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.28, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
      <motion.div
        className="absolute top-1/4 -left-1 w-0.5 h-0.5 bg-purple-500 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.25, 0],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.6,
        }}
      />
      <motion.div
        className="absolute top-3/4 -right-1 w-1 h-1 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.22, 0],
          rotate: [0, -90, -180],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.8,
        }}
      />
      <motion.div
        className="absolute top-1/2 -left-2 w-0.5 h-0.5 bg-purple-300 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.25, 0],
          rotate: [0, 45, 90],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.0,
        }}
      />
      <motion.div
        className="absolute top-1/3 -right-2 w-1 h-1 bg-purple-500 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.22, 0],
          rotate: [0, -45, -90],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.2,
        }}
      />
      <motion.div
        className="absolute top-2/3 -left-1.5 w-1 h-1 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.28, 0],
          rotate: [0, 135, 270],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.4,
        }}
      />
      <motion.div
        className="absolute top-1/6 -right-1.5 w-0.5 h-0.5 bg-purple-300 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.25, 0],
          rotate: [0, -135, -270],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.6,
        }}
      />
      <motion.div
        className="absolute top-5/6 -left-0.5 w-0.5 h-0.5 bg-purple-500 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.22, 0],
          rotate: [0, 60, 120],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.8,
        }}
      />
      <motion.div
        className="absolute top-1/8 -right-0.5 w-0.5 h-0.5 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.25, 0],
          rotate: [0, -60, -120],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 2.0,
        }}
      />

      {/* Top sparkles */}
      <motion.div
        className="absolute -top-2 left-1/4 w-1 h-1 bg-purple-300 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.28, 0],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.3,
        }}
      />
      <motion.div
        className="absolute -top-2 right-1/4 w-1 h-1 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.22, 0],
          rotate: [0, -90, -180],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.7,
        }}
      />
      <motion.div
        className="absolute -top-1.5 left-1/2 w-1 h-1 bg-purple-500 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.33, 0],
          rotate: [0, 45, 90],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.1,
        }}
      />

      {/* Bottom sparkles */}
      <motion.div
        className="absolute -bottom-2 left-1/3 w-1 h-1 bg-purple-400 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.28, 0],
          rotate: [0, -45, -90],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute -bottom-2 right-1/3 w-1 h-1 bg-purple-300 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.22, 0],
          rotate: [0, 135, 270],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.9,
        }}
      />
      <motion.div
        className="absolute -bottom-1.5 left-1/2 w-1 h-1 bg-purple-500 rounded-full z-20"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.33, 0],
          rotate: [0, -135, -270],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 1.3,
        }}
      />
    </>
  );
};
