"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { ExportPrivateKeyDialogProvider } from "./dialogs/exportPrivateKeyDialog";
import { ExportPrivateKeyButton } from "./ExportPrivateKeyButton";

export const SecuritySection = () => {
  return (
    <>
      <ExportPrivateKeyDialogProvider />
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full flex-shrink-0"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Export Private Key
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Export your private key to access your account from other
                  devices. This is a dangerous operation - anyone with your
                  private key can control your account.
                </p>
                <ExportPrivateKeyButton />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
