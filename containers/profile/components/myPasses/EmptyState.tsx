import { motion } from "framer-motion";
import { Heart, Package } from "lucide-react";

export const EmptyState = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Icon */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <Package className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </motion.div>
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
          initial={{ scale: 0, x: 10, y: -10 }}
          animate={{ scale: 1, x: 0, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.4,
            type: "spring",
            stiffness: 300,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-4 h-4 text-red-500" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h3
          className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          No Passes Yet
        </motion.h3>
        <motion.p
          className="text-gray-500 dark:text-gray-400 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          You haven't purchased any podium passes yet. When you do, they'll
          appear here for easy access.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
