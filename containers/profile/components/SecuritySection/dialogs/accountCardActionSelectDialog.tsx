"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Crown, Sparkles, Star, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../../components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/Dialog";

export type AccountCardActionSelectDialogResult = boolean | undefined;

let resolvePromise:
  | ((value: AccountCardActionSelectDialogResult) => void)
  | null = null;

export const accountCardActionSelectDialog =
  (): Promise<AccountCardActionSelectDialogResult> => {
    return new Promise((resolve) => {
      resolvePromise = resolve;

      const event = new CustomEvent("show-account-card-action-select-dialog");
      window.dispatchEvent(event);
    });
  };

export const AccountCardActionSelectDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "show-account-card-action-select-dialog",
      handleShowDialog
    );
    return () => {
      window.removeEventListener(
        "show-account-card-action-select-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleMakePrimary = () => {
    setIsOpen(false);
    resolvePromise?.(true);
    resolvePromise = null;
  };

  const handleGoBack = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center space-y-6"
          >
            {/* Animated Crown Icon */}
            <motion.div
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>

              {/* Floating sparkles */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </motion.div>

              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -bottom-1 -left-1"
              >
                <Zap className="w-4 h-4 text-orange-400" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Account Actions
              </DialogTitle>
            </motion.div>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
          className="py-6 space-y-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-3"
          >
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              What would you like to do with this account?
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <User className="w-4 h-4" />
              <span>Manage your account settings</span>
            </motion.div>
          </motion.div>

          {/* Action Options */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="space-y-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg"
              />
              <Button
                onClick={handleMakePrimary}
                variant="primary"
                className="relative w-full h-16 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-3"
                >
                  <Crown className="w-6 h-6" />
                </motion.div>
                Make Primary Account
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 flex content-center items-center"
            >
              <Star className="w-4 h-4 inline mr-1" />
              Primary accounts get priority access and special features
            </motion.div>
          </motion.div>
        </motion.div>

        <DialogFooter>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex w-full gap-3"
          >
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 group"
            >
              <motion.div whileHover={{ x: -3 }} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Go Back
              </motion.div>
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
