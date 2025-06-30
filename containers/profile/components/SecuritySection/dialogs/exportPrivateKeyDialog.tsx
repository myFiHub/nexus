"use client";

import { Button } from "app/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import { getStore } from "app/store";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Download, Eye, EyeOff, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export type ExportPrivateKeyDialogResult = string | undefined;

let resolvePromise: ((value: ExportPrivateKeyDialogResult) => void) | null =
  null;

export const exportPrivateKeyDialog =
  (): Promise<ExportPrivateKeyDialogResult> => {
    return new Promise((resolve) => {
      resolvePromise = resolve;

      const event = new CustomEvent("show-export-private-key-dialog");
      window.dispatchEvent(event);
    });
  };

export const ExportPrivateKeyDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
      setIsRevealing(false);
      setIsRevealed(false);
      setShowPrivateKey(false);
    };

    window.addEventListener("show-export-private-key-dialog", handleShowDialog);
    return () => {
      window.removeEventListener(
        "show-export-private-key-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleExport = async () => {
    setIsRevealing(true);

    const web3Auth = getStore().getState().global.web3Auth;
    if (!web3Auth) return;
    const provider = web3Auth.provider!;
    const privateKey: unknown = await provider.request({
      method: "private_key",
    });

    setIsRevealing(false);
    setIsRevealed(true);
    setPrivateKey(privateKey as string);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsRevealing(false);
    setIsRevealed(false);
    setShowPrivateKey(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  const handleConfirm = () => {
    setIsOpen(false);
    setIsRevealing(false);
    setIsRevealed(false);
    setShowPrivateKey(false);
    resolvePromise?.(privateKey);
    resolvePromise = null;
    setPrivateKey("");
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
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: isRevealing ? Infinity : 0,
              }}
              className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </motion.div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Export Private Key
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {/* Warning Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    ⚠️ DANGEROUS OPERATION
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Your private key is the only way to access your account.
                    Anyone with this key can control your funds and data. Never
                    share it with anyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="warning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  Are you absolutely sure you want to export your private key?
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleExport}
                    disabled={isRevealing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                  >
                    {isRevealing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Copy Private Key to Clipboard
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-muted rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Private Key
                    </span>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      {showPrivateKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-mono text-sm break-all"
                  >
                    {showPrivateKey ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-foreground"
                      >
                        {privateKey}
                      </motion.span>
                    ) : (
                      <span className="text-muted-foreground">
                        ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                      </span>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
                >
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> Copy this key immediately and
                    store it securely.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleConfirm}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                  >
                    I've Copied My Key
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
