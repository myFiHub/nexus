"use client";

import { motion } from "framer-motion";
import { AlertTriangle, LogIn, LogOut, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

export type ConfirmAddOrSwitchAccountDialogResult = {
  confirmed: boolean;
};

let resolvePromise:
  | ((value: ConfirmAddOrSwitchAccountDialogResult) => void)
  | null = null;

export const confirmAddOrSwitchAccountDialog =
  (): Promise<ConfirmAddOrSwitchAccountDialogResult> => {
    return new Promise((resolve) => {
      resolvePromise = resolve;

      const event = new CustomEvent(
        "show-confirm-add-or-switch-account-dialog"
      );
      window.dispatchEvent(event);
    });
  };

export const ConfirmAddOrSwitchAccountDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "show-confirm-add-or-switch-account-dialog",
      handleShowDialog
    );
    return () => {
      window.removeEventListener(
        "show-confirm-add-or-switch-account-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true });
    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false });
    resolvePromise = null;
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
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-16 h-16 bg-amber-200 dark:bg-amber-800/30 rounded-full"
              />
            </motion.div>

            <DialogTitle className="text-xl font-bold text-center">
              Add/Switch Account
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="py-4 space-y-4"
        >
          <div className="space-y-3 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              You will be logged out of your current account and logged in with
              the new account.
            </p>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Current session will end</span>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <LogIn className="w-4 h-4" />
              <span>New account will be activated</span>
            </motion.div>
          </div>
        </motion.div>

        <DialogFooter>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex w-full gap-3"
          >
            <Button
              colorScheme="primary"
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              colorScheme="primary"
              variant="primary"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Continue
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
