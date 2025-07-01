"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface LogoutDialogProps {
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
}

let resolvePromise: ((value: boolean) => void) | null = null;

export const logoutDialog = ({
  title = "Sign Out",
  content = "Are you sure you want to sign out? You'll need to log in again to access your account.",
  confirmText = "Sign Out",
  cancelText = "Cancel",
}: LogoutDialogProps = {}): Promise<boolean> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-logout-dialog", {
      detail: {
        title,
        content,
        confirmText,
        cancelText,
      },
    });
    window.dispatchEvent(event);
  });
};

export const LogoutDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<LogoutDialogProps | null>(
    null
  );

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<LogoutDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-logout-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-logout-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(true);
    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
    resolvePromise = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancel();
            }
          }}
        >
          <DialogContent
            className="p-0 overflow-hidden border-0 shadow-2xl max-w-md"
            showCloseButton={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="relative"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20" />

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(45deg, #ef4444, #f97316, #ef4444)",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="absolute inset-[1px] bg-background rounded-lg" />

              {/* Custom Close Button */}
              <motion.button
                onClick={handleCancel}
                className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors duration-200 group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.15 }}
              >
                <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                <span className="sr-only">Close</span>
              </motion.button>

              {/* Header */}
              <DialogHeader className="relative p-6 pb-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.15 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {dialogContent?.title || "Sign Out"}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Account Security
                    </p>
                  </div>
                </motion.div>
              </DialogHeader>

              {/* Content */}
              <motion.div
                className="relative px-6 pb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.15 }}
              >
                <div className="flex gap-3">
                  <motion.div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <p className="text-muted-foreground leading-relaxed">
                    {dialogContent?.content ||
                      "Are you sure you want to sign out? You'll need to log in again to access your account."}
                  </p>
                </div>
              </motion.div>

              {/* Footer */}
              <DialogFooter className="relative p-6 pt-0">
                <motion.div
                  className="flex gap-3 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      className="w-full h-12 border border-border hover:bg-muted/50 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {dialogContent?.cancelText || "Cancel"}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleConfirm}
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                      {dialogContent?.confirmText || "Sign Out"}
                    </Button>
                  </motion.div>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
