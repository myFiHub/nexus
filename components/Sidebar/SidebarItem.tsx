import { cn } from "app/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";
import { SidebarItemProps } from "./types";

export function SidebarItem({
  onClick,
  icon: Icon,
  label,
  tooltip,
  isOpen,
  isMobile,
  loading,
  isActive,
  needsAuth,
  index,
  isDanger,
}: SidebarItemProps) {
  const [hasAudioWavePlayed, setHasAudioWavePlayed] = useState(false); // Default to false to allow animation
  const [showAuthAnimation, setShowAuthAnimation] = useState(false);
  useEffect(() => {
    // Check if audio wave animation has already played
    if (typeof window !== "undefined") {
      const audioWavePlayed = localStorage.getItem("sidebar-audio-wave-played");
      if (audioWavePlayed === "true") {
        // Animation has already played, skip it
        setHasAudioWavePlayed(true);
      } else {
        // Animation hasn't played yet, let it play and then mark as played
        const timer = setTimeout(() => {
          setHasAudioWavePlayed(true);
          localStorage.setItem("sidebar-audio-wave-played", "true");
        }, 1000 + index * 50); // Allow time for animation to complete
        return () => clearTimeout(timer);
      }
    }
  }, [index]);

  useEffect(() => {
    // Trigger auth animation after wave effect completes (if needed)
    if (needsAuth && !hasAudioWavePlayed) {
      const authTimer = setTimeout(() => {
        setShowAuthAnimation(true);
      }, 1200 + index * 50); // Delay after wave animation
      return () => clearTimeout(authTimer);
    } else if (needsAuth && hasAudioWavePlayed) {
      // If wave already played, show auth animation immediately
      setShowAuthAnimation(true);
    }
  }, [needsAuth, index, hasAudioWavePlayed]);

  // Audio wave slide-in effect with staggered timing
  const audioWaveVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        delay: index * 0.05, // Staggered wave effect
      },
    },
    static: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
    },
  };

  // Special auth item animations
  const authItemVariants = {
    initial: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
    },
    animate: {
      height: "auto",
      opacity: 1,
      overflow: "visible",
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    flash: {
      backgroundColor: [
        "transparent",
        "rgba(var(--primary), 0.3)",
        "transparent",
        "rgba(var(--primary), 0.4)",
        "transparent",
      ],
      borderColor: [
        "transparent",
        "rgba(var(--primary), 0.6)",
        "transparent",
        "rgba(var(--primary), 0.8)",
        "transparent",
      ],
      boxShadow: [
        "none",
        "0 0 20px rgba(var(--primary), 0.5)",
        "none",
        "0 0 25px rgba(var(--primary), 0.6)",
        "none",
      ],
      transition: {
        duration: 1.2,
        ease: "easeInOut" as const,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
    static: {
      height: "auto",
      opacity: 1,
      overflow: "visible",
    },
  };

  const iconVariants = {
    idle: {
      rotate: 0,
      scale: 1,
      filter: "drop-shadow(0 0 0 transparent)",
    },
    hover: {
      rotate: [0, -10, 10, -5, 5, 0],
      scale: [1, 1.1, 1.05, 1.1, 1],
      filter: "drop-shadow(0 0 8px rgba(var(--primary), 0.4))",
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
    authFlash: {
      scale: [1, 1.2, 1, 1.15, 1],
      filter: [
        "drop-shadow(0 0 0 transparent)",
        "drop-shadow(0 0 15px rgba(var(--primary), 0.8))",
        "drop-shadow(0 0 0 transparent)",
        "drop-shadow(0 0 20px rgba(var(--primary), 1))",
        "drop-shadow(0 0 0 transparent)",
      ],
      transition: {
        duration: 1.2,
        ease: "easeInOut" as const,
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  };

  const backgroundVariants = {
    idle: {
      opacity: 0,
      scale: 0.8,
      backgroundPosition: "0% 50%",
    },
    hover: {
      opacity: 1,
      scale: 1,
      backgroundPosition: "100% 50%",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      },
    },
  };

  const labelVariants = {
    hidden: {
      opacity: 0,
      width: 0,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      width: "auto",
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        delay: isOpen ? 0.15 : 0,
        ease: "easeOut" as const,
      },
    },
  };

  // Determine animation state based on whether audio wave has played
  const getAnimationState = () => {
    if (needsAuth) {
      if (hasAudioWavePlayed) {
        return showAuthAnimation && !isDanger ? "flash" : "static";
      } else {
        return showAuthAnimation && !isDanger ? "flash" : "animate";
      }
    } else {
      return hasAudioWavePlayed ? "static" : "visible";
    }
  };

  const getInitialState = () => {
    if (needsAuth) {
      return hasAudioWavePlayed ? "static" : "initial";
    } else {
      return hasAudioWavePlayed ? "static" : "hidden";
    }
  };

  const containerVariants = needsAuth ? authItemVariants : audioWaveVariants;

  const sidebarItem = (
    <motion.div
      className={cn("relative group")}
      variants={containerVariants}
      initial={getInitialState()}
      animate={getAnimationState()}
      whileHover={{
        scale: 1.03,
        x: isOpen ? 8 : 2,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 25,
          mass: 0.8,
        },
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 },
      }}
    >
      <motion.div
        onClick={onClick}
        className={cn(
          "flex items-center rounded-lg hover:bg-accent relative overflow-hidden cursor-pointer min-h-12",
          "transition-all duration-300 ease-out",
          "border border-transparent hover:border-primary/20",
          isActive &&
            "bg-primary/20 border-primary/30 shadow-lg shadow-primary/10",
          needsAuth && "border-dashed border-primary/40",
          isDanger && "border-dashed border-red-500"
        )}
        style={{
          padding: "10px",
        }}
        whileHover="hover"
        initial="idle"
      >
        {/* Enhanced gradient background */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 opacity-0",
            "background-size: 200% 100%"
          )}
          variants={backgroundVariants}
          style={{
            backgroundSize: "200% 100%",
          }}
        />

        {/* Special auth glow effect */}
        {needsAuth && showAuthAnimation && !isDanger && (
          <motion.div
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-lg",
              isDanger &&
                "bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-500/20"
            )}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0, 0.8, 0],
              scale: [1, 1.02, 1, 1.01, 1],
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut" as const,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        )}

        {/* Shimmer effect */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
          )}
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            opacity: [0, 1, 0],
            transition: { duration: 0.6, ease: "easeInOut" as const },
          }}
        />

        {/* Icon with enhanced animations */}
        <motion.div
          variants={iconVariants}
          className={cn("shrink-0 relative z-10", isDanger && "text-red-500")}
          animate={
            needsAuth && showAuthAnimation && !isDanger ? "authFlash" : "idle"
          }
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <Icon className={cn("h-5 w-5", isDanger && "text-red-500")} />
          )}
        </motion.div>

        {/* Label with enhanced animations */}
        <div className="w-content max-h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.span
                className={cn(
                  "truncate relative z-10 ml-3 font-medium",
                  needsAuth && "text-primary/90",
                  isDanger && "text-red-500"
                )}
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              type: "spring" as const,
              stiffness: 500,
              damping: 30,
            }}
          />
        )}

        {/* Auth indicator line */}
        {needsAuth && (
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent",
              isDanger && "bg-gradient-to-r from-red-500/60 to-transparent"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        )}
      </motion.div>
    </motion.div>
  );

  // Wrap with tooltip only when sidebar is closed and not on mobile
  if (!isOpen && !isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{sidebarItem}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <div className="flex items-center gap-2 text-white">
            <span>{tooltip || label}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return sidebarItem;
}
