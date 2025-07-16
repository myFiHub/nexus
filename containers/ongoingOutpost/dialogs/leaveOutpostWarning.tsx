"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Clock, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dialog";

interface LeaveOutpostWarningDialogProps {
  outpostName: string;
  onlineMembersCount: number;
}

export type LeaveOutpostWarningDialogResult = boolean;

let resolvePromise: ((value: LeaveOutpostWarningDialogResult) => void) | null =
  null;
let currentProps: LeaveOutpostWarningDialogProps | null = null;

export const leaveOutpostWarningDialog = (
  props: LeaveOutpostWarningDialogProps
): Promise<LeaveOutpostWarningDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;
    currentProps = props;

    const event = new CustomEvent("show-leave-outpost-warning-dialog");
    window.dispatchEvent(event);
  });
};

export const LeaveOutpostWarningDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoveringCancel, setIsHoveringCancel] = useState(false);
  const [isHoveringLeave, setIsHoveringLeave] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "show-leave-outpost-warning-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-leave-outpost-warning-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(true);
    resolvePromise = null;
    currentProps = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
    resolvePromise = null;
    currentProps = null;
  };

  const outpostName = currentProps?.outpostName || "this outpost";
  const onlineMembersCount = currentProps?.onlineMembersCount || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              // When dialog is closed (by clicking outside, pressing escape, etc.), treat as cancel
              handleCancel();
            }
          }}
        >
          <DialogContent showCloseButton={false}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.1, ease: "easeIn" },
              }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Background decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.05, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg -z-10"
              />

              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <DialogTitle>Leave Outpost?</DialogTitle>
                </motion.div>
              </DialogHeader>

              <motion.div
                className="py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 5,
                  transition: { duration: 0.1, delay: 0 },
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.1,
                }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="text-sm text-muted-foreground mb-4"
                >
                  Are you sure you want to leave{" "}
                  <span className="font-medium text-foreground">
                    "{outpostName}"
                  </span>
                  ? You will lose access to the current session.
                </motion.p>

                {/* Member count card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-muted/50 rounded-lg p-3 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.25,
                        type: "spring",
                      }}
                      className="p-1.5 bg-primary/10 rounded-full"
                    >
                      {onlineMembersCount === 1 ? (
                        <Clock className="w-4 h-4 text-primary" />
                      ) : (
                        <Users className="w-4 h-4 text-primary" />
                      )}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-xs text-muted-foreground"
                    >
                      {onlineMembersCount > 1 ? (
                        <span>
                          There are currently {onlineMembersCount} people in
                          this outpost.
                        </span>
                      ) : onlineMembersCount === 1 ? (
                        <span>You are the only one here.</span>
                      ) : (
                        <span>
                          You are currently the only person in this outpost.
                        </span>
                      )}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Warning message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-yellow-800 dark:text-yellow-200">
                    You'll need to rejoin the outpost if you want to participate
                    again.
                  </span>
                </motion.div>
              </motion.div>

              <DialogFooter>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 5,
                    transition: { duration: 0.1, delay: 0 },
                  }}
                  transition={{
                    duration: 0.2,
                    delay: 0.25,
                  }}
                  className="flex gap-3 w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHoveringCancel(true)}
                    onHoverEnd={() => setIsHoveringCancel(false)}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      className="w-full relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: isHoveringCancel ? 0 : -20,
                          opacity: isHoveringCancel ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-2"
                      >
                        <Clock className="w-4 h-4" />
                      </motion.div>
                      <motion.span
                        animate={{ x: isHoveringCancel ? 8 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {onlineMembersCount === 1
                          ? "Wait for Others"
                          : "Cancel"}
                      </motion.span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHoveringLeave(true)}
                    onHoverEnd={() => setIsHoveringLeave(false)}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleConfirm}
                      variant="destructive"
                      className="w-full relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: isHoveringLeave ? 0 : -20,
                          opacity: isHoveringLeave ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-2"
                      >
                        <X className="w-4 h-4" />
                      </motion.div>
                      <motion.span
                        animate={{ x: isHoveringLeave ? 8 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Leave Outpost
                      </motion.span>
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
