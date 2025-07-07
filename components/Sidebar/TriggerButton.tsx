import { cn } from "app/lib/utils";
import { motion } from "framer-motion";
import { ChevronRightIcon, MenuIcon } from "lucide-react";
import { TriggerButtonProps } from "./types";

export function TriggerButton({
  isOpen,
  onClick,
  controls,
  isMobile,
  hasBeenClicked = false,
}: TriggerButtonProps) {
  // Only show animations on mobile if button hasn't been clicked yet
  const shouldAnimateOnMobile = isMobile && !hasBeenClicked && !isOpen;

  // Static mobile button variants (no animations)
  const staticMobileVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 4px 16px rgba(var(--primary), 0.2)",
    },
  };

  // Enhanced mobile pulse animation when should animate
  const mobilePulseVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 8px 32px rgba(var(--primary), 0.3)",
    },
    pulse: {
      scale: [1, 1.2, 1],
      boxShadow: [
        "0 8px 32px rgba(var(--primary), 0.3)",
        "0 12px 48px rgba(var(--primary), 0.5)",
        "0 8px 32px rgba(var(--primary), 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <>
      {/* Desktop version - stays in sidebar */}
      {!isMobile && (
        <motion.button
          onClick={onClick}
          className="absolute top-[240px] -right-4 z-50 h-8 w-8 rounded-full border-2 border-primary bg-background shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center group cursor-pointer"
          animate={controls}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            initial={{ scale: 0, opacity: 1 }}
            whileTap={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}

      {/* Mobile version - moves with sidebar */}
      {isMobile && (
        <motion.button
          onClick={onClick}
          className={cn(
            "fixed top-20 z-[60] h-14 w-14 rounded-full border-2 border-primary bg-background shadow-2xl",
            "hover:bg-primary hover:text-primary-foreground transition-all duration-300",
            "flex items-center justify-center group backdrop-blur-sm",
            "hover:scale-110 active:scale-95",
            // Only add bounce animation if should animate
            shouldAnimateOnMobile && "animate-bounce"
          )}
          style={{
            background: isOpen
              ? "hsl(var(--background))"
              : shouldAnimateOnMobile
              ? "linear-gradient(135deg, hsl(var(--background)), hsl(var(--primary) / 0.1))"
              : "hsl(var(--background))",
          }}
          variants={
            shouldAnimateOnMobile ? mobilePulseVariants : staticMobileVariants
          }
          initial="idle"
          animate={{
            ...(shouldAnimateOnMobile
              ? mobilePulseVariants.pulse
              : staticMobileVariants.idle),
            left: isOpen ? "244px" : "16px", // 244px = 260px sidebar width - 16px button margin
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: shouldAnimateOnMobile ? 1.1 : 1.05 }} // Reduce hover scale when not animating
          transition={{
            left: { duration: 0.3, ease: "easeInOut" },
            scale: { duration: 0.2 },
            ...(shouldAnimateOnMobile
              ? mobilePulseVariants.pulse.transition
              : {}),
          }}
        >
          {/* Animated background glow - only when should animate */}
          {shouldAnimateOnMobile && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Ripple effect - only when should animate */}
          {shouldAnimateOnMobile && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Icon container */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isOpen ? (
              <ChevronRightIcon className="h-6 w-6" />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <MenuIcon className="h-6 w-6" />
              </motion.div>
            )}
          </motion.div>

          {/* Highlight indicator when hidden - only when should animate */}
          {shouldAnimateOnMobile && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Tap feedback */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            initial={{ scale: 0, opacity: 1 }}
            whileTap={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}

      {/* Mobile overlay hint when hidden - only when should animate */}
      {shouldAnimateOnMobile && (
        <motion.div
          className="fixed top-36 z-50 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium pointer-events-none"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            left: isOpen ? "244px" : "16px",
          }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{
            duration: 0.3,
            delay: 1,
            left: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          Tap to open menu
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-primary/90"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 }}
          />
        </motion.div>
      )}
    </>
  );
}
