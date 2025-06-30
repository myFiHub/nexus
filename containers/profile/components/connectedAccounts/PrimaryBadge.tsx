import { motion } from "framer-motion";

interface PrimaryBadgeProps {
  className?: string;
}

export const PrimaryBadge = ({ className = "" }: PrimaryBadgeProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative inline-block mt-1 ${className}`}
    >
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, #FFD700, #FFA500, #FFD700)",
            "linear-gradient(45deg, #FFA500, #FFD700, #FFA500)",
            "linear-gradient(45deg, #FFD700, #FFA500, #FFD700)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg overflow-hidden"
      >
        <span className="relative z-10">Primary</span>

        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-sm"
      />

      {/* Sparkling particles around the badge */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Top particle */}
        <motion.div
          animate={{
            scale: [0.3, 0.8, 0.3],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-0.5 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-0.5 h-0.5 bg-yellow-300/60 rounded-full" />
        </motion.div>

        {/* Right particle */}
        <motion.div
          animate={{
            scale: [0.3, 0.8, 0.3],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/2 -right-0.5 transform -translate-y-1/2"
        >
          <div className="w-0.5 h-0.5 bg-orange-300/60 rounded-full" />
        </motion.div>

        {/* Bottom particle */}
        <motion.div
          animate={{
            scale: [0.3, 0.8, 0.3],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-0.5 h-0.5 bg-yellow-300/60 rounded-full" />
        </motion.div>

        {/* Left particle */}
        <motion.div
          animate={{
            scale: [0.3, 0.8, 0.3],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-1/2 -left-0.5 transform -translate-y-1/2"
        >
          <div className="w-0.5 h-0.5 bg-orange-300/60 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
