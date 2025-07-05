import { cn } from "app/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
}: SidebarItemProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showAuthAnimation, setShowAuthAnimation] = useState(false);

  useEffect(() => {
    // Initial load timing for audio wave effect
    const timer = setTimeout(() => {
      setHasLoaded(true);

      // Trigger auth animation after wave effect completes
      if (needsAuth) {
        const authTimer = setTimeout(() => {
          setShowAuthAnimation(true);
        }, 500 + index * 50); // Delay after wave animation
        return () => clearTimeout(authTimer);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [needsAuth, index]);

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

  const containerVariants = needsAuth ? authItemVariants : {};

  return (
    <motion.div
      className={cn("relative group")}
      variants={needsAuth ? containerVariants : audioWaveVariants}
      initial={needsAuth ? "initial" : "hidden"}
      animate={
        needsAuth
          ? showAuthAnimation
            ? "flash"
            : "animate"
          : hasLoaded
          ? "visible"
          : "hidden"
      }
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
          needsAuth && "border-dashed border-primary/40"
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
        {needsAuth && showAuthAnimation && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-lg"
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
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
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
          className="shrink-0 relative z-10"
          animate={needsAuth && showAuthAnimation ? "authFlash" : "idle"}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-5 w-5" />
            </motion.div>
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </motion.div>

        {/* Label with enhanced animations */}
        <div className="w-content max-h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.span
                className={cn(
                  "truncate relative z-10 ml-3 font-medium",
                  needsAuth && "text-primary/90"
                )}
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {label}
                {needsAuth && (
                  <motion.span
                    className="ml-2 text-xs text-primary/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    🔐
                  </motion.span>
                )}
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
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        )}
      </motion.div>

      {/* Enhanced tooltip */}
      <AnimatePresence>
        {!isOpen && !isMobile && (
          <motion.div
            className={cn(
              "absolute left-full ml-4 top-1/2 -translate-y-1/2",
              "bg-black/90 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl shadow-2xl",
              "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap",
              "border border-white/10"
            )}
            initial={{
              scale: 0.8,
              x: -20,
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={{
              scale: 1,
              x: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring" as const,
                stiffness: 500,
                damping: 30,
                mass: 0.8,
              },
            }}
            exit={{
              scale: 0.8,
              x: -20,
              opacity: 0,
              filter: "blur(4px)",
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{tooltip || label}</span>
                  {needsAuth && <span className="text-xs">🔐</span>}
                </div>
              )}
            </motion.div>

            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90" />

            {/* Tooltip glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
