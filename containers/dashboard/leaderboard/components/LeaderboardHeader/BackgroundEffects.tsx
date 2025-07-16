"use client";

import { motion } from "framer-motion";
import { FloatingParticle } from "./FloatingParticle";
import { RotatingStar } from "./RotatingStar";

export const BackgroundEffects = () => {
  return (
    <>
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
    </>
  );
};
