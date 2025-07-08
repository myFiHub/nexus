"use client";

import { Img } from "app/components/Img";
import { localLogoUrl } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";
import { motion } from "framer-motion";
import {
  Clock,
  Coffee,
  Heart,
  Mic,
  Moon,
  Music,
  Star,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WaitingForCreatorProps {
  outpost?: OutpostModel;
}

const floatingIcons = [
  {
    Icon: Coffee,
    delay: 0,
    color: "text-amber-400",
    position: { left: "10%", top: "15%", zIndex: 0 },
  },
  {
    Icon: Music,
    delay: 0.5,
    color: "text-purple-400",
    position: { left: "85%", top: "20%", zIndex: 10 },
  },
  {
    Icon: Heart,
    delay: 1,
    color: "text-pink-400",
    position: { left: "15%", top: "75%", zIndex: 10 },
  },
  {
    Icon: Zap,
    delay: 1.5,
    color: "text-yellow-400",
    position: { left: "80%", top: "80%", zIndex: 0 },
  },
  {
    Icon: Star,
    delay: 2,
    color: "text-blue-400",
    position: { left: "5%", top: "50%", zIndex: 10 },
  },
  {
    Icon: Moon,
    delay: 2.5,
    color: "text-indigo-400",
    position: { left: "90%", top: "60%", zIndex: 0 },
  },
  {
    Icon: Sun,
    delay: 3,
    color: "text-orange-400",
    position: { left: "70%", top: "10%", zIndex: 10 },
  },
];
const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export const WaitingForCreator = ({ outpost }: WaitingForCreatorProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const creatorName = outpost?.creator_user_name || "Creator";
  const outpostName = outpost?.name || "Outpost";
  const outpostImage = outpost?.image || localLogoUrl;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      {floatingIcons.map(({ Icon, delay, color, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-20`}
          style={{
            left: position.left,
            top: position.top,
            zIndex: position.zIndex,
          }}
          animate={{
            y: [-15 + index * 2, 15 - index * 2, -15 + index * 2],
            x: [-8 + index * 1, 8 - index * 1, -8 + index * 1],
            rotate: [0, 8 + index * 2, -8 - index * 2, 0],
            scale: [1, 1.1 + index * 0.05, 0.9 - index * 0.05, 1],
            opacity: [0.15, 0.25 + index * 0.02, 0.15],
          }}
          transition={{
            duration: 4 + index * 0.5,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={24 + index * 2} />
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Card */}
        <motion.div
          className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden relative"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20"
            animate={{
              background: [
                "linear-gradient(45deg, hsl(var(--primary)/0.2), hsl(var(--secondary)/0.2), hsl(var(--primary)/0.2))",
                "linear-gradient(45deg, hsl(var(--secondary)/0.2), hsl(var(--primary)/0.2), hsl(var(--secondary)/0.2))",
                "linear-gradient(45deg, hsl(var(--primary)/0.2), hsl(var(--secondary)/0.2), hsl(var(--primary)/0.2))",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Outpost Image with floating animation */}
            <motion.div
              className="relative mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden shadow-2xl mx-auto relative border-4 border-primary/20"
                variants={pulseVariants}
                animate="pulse"
              >
                <Img
                  src={outpostImage}
                  alt={outpostName}
                  className="w-full h-full object-cover"
                  sizes="96px"
                />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold text-foreground mb-4"
              variants={itemVariants}
            >
              Waiting for {creatorName}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              variants={itemVariants}
            >
              The creator will join {outpostName} soon
            </motion.p>

            {/* Status indicators */}
            <motion.div
              className="flex items-center justify-center gap-8 mb-8"
              variants={itemVariants}
            >
              {/* Clock indicator */}
              <motion.div
                className="flex items-center gap-3 text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-6 h-6" />
                </motion.div>
                <span className="text-sm font-medium">
                  {currentTime.toLocaleTimeString()}
                </span>
              </motion.div>

              {/* Users indicator */}
              <motion.div
                className="flex items-center gap-3 text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Users className="w-6 h-6" />
                </motion.div>
                <span className="text-sm font-medium">Ready to join</span>
              </motion.div>

              {/* Mic indicator */}
              <motion.div
                className="flex items-center gap-3 text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Mic className="w-6 h-6" />
                </motion.div>
                <span className="text-sm font-medium">Audio ready</span>
              </motion.div>
            </motion.div>

            {/* Encouraging message */}
            <motion.div className="text-center" variants={itemVariants}>
              <motion.p
                className="text-muted-foreground mb-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Get ready for an amazing conversation! 🚀
              </motion.p>

              {/* Animated dots */}
              <motion.div className="flex justify-center gap-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
