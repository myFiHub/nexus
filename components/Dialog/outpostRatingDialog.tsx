"use client";

/**
 * Outpost Rating Dialog Component
 *
 * Usage example:
 *
 * import { outpostRatingDialog } from "app/components/Dialog";
 *
 * const handleRateOutpost = async () => {
 *   const rating = await outpostRatingDialog();
 *
 *   if (rating !== undefined) {
 *     // User confirmed with rating (1-5)
 *     console.log(`User rated: ${rating} stars`);
 *     // Proceed with rating action
 *   } else {
 *     // User cancelled or clicked outside
 *     console.log("User cancelled rating");
 *   }
 * };
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

export type OutpostRatingDialogResult = number | undefined;

let resolvePromise: ((value: OutpostRatingDialogResult) => void) | null = null;

export const outpostRatingDialog = (): Promise<OutpostRatingDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-outpost-rating-dialog");
    window.dispatchEvent(event);
  });
};

export const OutpostRatingDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
      setSelectedRating(null);
      setHoveredRating(null);
    };

    window.addEventListener(
      "show-outpost-rating-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-outpost-rating-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    if (selectedRating !== null) {
      setIsOpen(false);
      resolvePromise?.(selectedRating);
      resolvePromise = null;
      setSelectedRating(null);
      setHoveredRating(null);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
    setSelectedRating(null);
    setHoveredRating(null);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleRatingHover = (rating: number | null) => {
    setHoveredRating(rating);
  };

  const getStarEmoji = (rating: number) => {
    const currentRating = hoveredRating || selectedRating || 0;
    return currentRating >= rating ? "⭐" : "☆";
  };

  const getRatingText = () => {
    const rating = hoveredRating || selectedRating;
    if (!rating) return "Rate this outpost";

    const texts = ["Terrible", "Poor", "Fair", "Good", "Excellent"];
    return texts[rating - 1];
  };

  const getRatingColor = () => {
    const rating = hoveredRating || selectedRating;
    if (!rating) return "text-muted-foreground";

    const colors = [
      "text-red-500",
      "text-orange-500",
      "text-yellow-500",
      "text-blue-500",
      "text-green-500",
    ];
    return colors[rating - 1];
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const starVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "backOut" as const,
      },
    }),
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 },
    },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rate This Outpost
              </DialogTitle>
            </motion.div>

            <motion.div
              className="text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <p className="text-sm text-muted-foreground">
                How would you rate your experience?
              </p>
            </motion.div>
          </DialogHeader>

          <motion.div
            className="py-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Stars Container */}
            <motion.div
              className="flex justify-center items-center gap-2 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  custom={rating}
                  variants={starVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => handleRatingHover(rating)}
                  onMouseLeave={() => handleRatingHover(null)}
                  className="text-4xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                  style={{
                    filter:
                      selectedRating === rating
                        ? "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.5))"
                        : hoveredRating === rating
                        ? "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))"
                        : "none",
                  }}
                >
                  <motion.span
                    animate={{
                      scale: selectedRating === rating ? [1, 1.1, 1] : 1,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {getStarEmoji(rating)}
                  </motion.span>
                </motion.button>
              ))}
            </motion.div>

            {/* Rating Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredRating || selectedRating || 0}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.p
                  className={`text-lg font-semibold ${getRatingColor()}`}
                  animate={{
                    scale: hoveredRating ? [1, 1.05, 1] : 1,
                    transition: { duration: 0.2 },
                  }}
                >
                  {getRatingText()}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Feedback Particles Animation */}
            <AnimatePresence>
              {selectedRating && selectedRating >= 4 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400 text-2xl"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: "30%",
                      }}
                      initial={{
                        scale: 0,
                        opacity: 0,
                        y: 0,
                        rotate: 0,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: [-20, -40, -60],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <DialogFooter>
            <motion.div
              className="flex gap-2 w-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <motion.div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="flex-1">
                <motion.div
                  whileHover={selectedRating ? { scale: 1.02 } : {}}
                  whileTap={selectedRating ? { scale: 0.98 } : {}}
                  animate={
                    !selectedRating
                      ? {
                          x: [-3, 3, -3, 3, 0],
                          transition: {
                            duration: 0.4,
                            repeat: Infinity,
                            repeatDelay: 2,
                          },
                        }
                      : {
                          scale: [1, 1.05, 1],
                          transition: { duration: 0.3 },
                        }
                  }
                >
                  <motion.div
                    className={`w-full ${
                      selectedRating ? "shadow-lg shadow-blue-500/30" : ""
                    }`}
                    animate={
                      selectedRating
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 8px rgba(59, 130, 246, 0)",
                              "0 0 0 0 rgba(59, 130, 246, 0)",
                            ],
                            transition: { duration: 2, repeat: Infinity },
                          }
                        : {}
                    }
                  >
                    <Button
                      onClick={handleConfirm}
                      variant="primary"
                      disabled={!selectedRating}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {selectedRating
                        ? `Rate ${selectedRating} Star${
                            selectedRating > 1 ? "s" : ""
                          }`
                        : "Select Rating"}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
