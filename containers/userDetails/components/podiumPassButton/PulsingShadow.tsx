import { motion } from "framer-motion";

export const PulsingShadow = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(147, 51, 234, 0.2)",
          "0 0 0 12px rgba(147, 51, 234, 0)",
          "0 0 0 0 rgba(147, 51, 234, 0.2)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className="relative rounded-xl"
    >
      {children}
    </motion.div>
  );
};
