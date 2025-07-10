"use client";

// Usage example:
//
// import { promptNotifications, resetNotificationsDeclined } from "app/components/Dialog";
//
// const handlePromptNotifications = async () => {
//   const enabled = await promptNotifications();
//   if (enabled) {
//     console.log("User enabled notifications");
//     // Handle enabling notifications
//   } else {
//     console.log("User declined notifications");
//     // Handle declining notifications
//   }
// };
//
// // To reset the declined state (e.g., in settings):
// const handleResetDeclined = () => {
//   resetNotificationsDeclined();
//   console.log("Notifications prompt will show again");
// };

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Check,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

export type PromptNotificationsResult = boolean;

let resolvePromise: ((value: PromptNotificationsResult) => void) | null = null;

export const promptNotifications = (): Promise<PromptNotificationsResult> => {
  return new Promise((resolve) => {
    // Check if user has previously declined
    if (typeof window !== "undefined") {
      const hasDeclined = localStorage.getItem("notifications-declined");
      if (hasDeclined === "true") {
        resolve(false);
        return;
      }
    }

    resolvePromise = resolve;

    const event = new CustomEvent("show-prompt-notifications-dialog");
    window.dispatchEvent(event);
  });
};

export const resetNotificationsDeclined = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("notifications-declined");
  }
};

const BenefitItem = ({
  icon: Icon,
  title,
  description,
  className = "",
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.5,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    whileHover={{
      scale: 1.02,
      transition: { duration: 0.2 },
    }}
    className={`flex items-start space-x-3 p-3 rounded-lg bg-white/80 border border-gray-100 ${className}`}
  >
    <motion.div
      className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center"
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2 },
      }}
    >
      <Icon className="w-5 h-5 text-white" />
    </motion.div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export const PromptNotificationsDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "show-prompt-notifications-dialog",
      handleShowDialog
    );
    return () => {
      window.removeEventListener(
        "show-prompt-notifications-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleEnable = () => {
    setIsOpen(false);
    resolvePromise?.(true);
    resolvePromise = null;
  };

  const handleDecline = () => {
    setIsOpen(false);
    resolvePromise?.(false);
    resolvePromise = null;
    // Mark user as declined
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications-declined", "true");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed (by clicking outside, pressing escape, etc.), treat as decline
          handleDecline();
        }
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 text-white overflow-hidden">
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-24 h-24 bg-white/15 rounded-full translate-y-12 -translate-x-12"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.15, 0.35, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />

                <DialogHeader className="relative z-10">
                  <motion.div
                    className="flex items-center justify-center mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <Bell className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-900" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4,
                    }}
                  >
                    <DialogTitle className="text-xl font-bold text-center text-white">
                      Stay in the Loop! 🔔
                    </DialogTitle>
                    <p className="text-center text-purple-100 text-sm mt-2">
                      Never miss out on what matters most to you
                    </p>
                  </motion.div>
                </DialogHeader>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.6,
                  }}
                >
                  <BenefitItem
                    icon={Users}
                    title="New Followers"
                    description="Get notified when someone follows you and discover new connections"
                    delay={0.7}
                  />
                  <BenefitItem
                    icon={MessageSquare}
                    title="Outpost Updates"
                    description="Stay updated on new outposts, comments, and community activity"
                    delay={0.8}
                  />
                  <BenefitItem
                    icon={Calendar}
                    title="Smart Reminders"
                    description="Never miss scheduled outposts or important events"
                    delay={0.9}
                  />
                  <BenefitItem
                    icon={Bell}
                    title="Real-time Alerts"
                    description="Instant notifications for live outposts and urgent updates"
                    delay={1.0}
                  />
                </motion.div>

                <motion.div
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.1,
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      You can change this anytime in settings
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <DialogFooter className="p-6 pt-0 space-y-3">
                <div className="flex w-full gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.2,
                    }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      className="w-full border-gray-300 text-white-500 hover:bg-gray-50 hover:text-gray-900 font-medium py-3 rounded-lg transition-all duration-200"
                    >
                      Maybe Later
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.3,
                    }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleEnable}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Enable Notifications
                    </Button>
                  </motion.div>
                </div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
