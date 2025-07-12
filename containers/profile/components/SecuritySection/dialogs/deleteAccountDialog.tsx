"use client";

import { Button } from "app/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import { Input } from "app/components/Input";
import { getStore } from "app/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type DeleteAccountDialogResult = boolean;

let resolvePromise: ((value: DeleteAccountDialogResult) => void) | null = null;

export const deleteAccountDialog = (): Promise<DeleteAccountDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-delete-account-dialog");
    window.dispatchEvent(event);
  });
};

export const DeleteAccountDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<
    "warning" | "export" | "exported" | "confirm"
  >("warning");
  const [isExporting, setIsExporting] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
      setStep("warning");
      setIsExporting(false);
      setPrivateKey("");
      setShowPrivateKey(false);
      setConfirmText("");
      setIsDeleting(false);
    };

    window.addEventListener("show-delete-account-dialog", handleShowDialog);
    return () => {
      window.removeEventListener(
        "show-delete-account-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleExportPrivateKey = async () => {
    setIsExporting(true);

    try {
      const web3Auth = getStore().getState().global.web3Auth;
      if (!web3Auth) return;
      const provider = web3Auth.provider!;
      const privateKey: unknown = await provider.request({
        method: "private_key",
      });

      setPrivateKey(privateKey as string);
      setStep("exported");
    } catch (error) {
      console.error("Failed to export private key:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleProceedToDelete = () => {
    setStep("confirm");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "delete account") return;
    setIsDeleting(true);
    setIsDeleting(false);
    handleClose(true);
  };

  const handleClose = (confirmed: boolean = false) => {
    setIsOpen(false);
    setStep("warning");
    setIsExporting(false);
    setPrivateKey("");
    setShowPrivateKey(false);
    setConfirmText("");
    setIsDeleting(false);
    resolvePromise?.(confirmed);
    resolvePromise = null;
  };

  const isConfirmValid = confirmText === "delete account";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose(false);
        }
      }}
    >
      <DialogContent className="max-w-lg overflow-hidden">
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
                repeat: isDeleting ? Infinity : 0,
              }}
              className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full"
            >
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </motion.div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Delete Account
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
          className="space-y-4 min-h-[420px]"
        >
          {/* Critical Warning Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    🚨 IRREVERSIBLE ACTION
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    This action will permanently delete your account and all
                    associated data. This cannot be undone. Make sure you have
                    exported your private key first.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {step === "warning" && (
              <motion.div
                key="warning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Before You Delete
                      </h4>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>
                          • Export your private key to backup your account
                        </li>
                        <li>
                          • Transfer any remaining funds to another wallet
                        </li>
                        <li>• Save any important data from your profile</li>
                        <li>
                          • Consider the impact on your connected services
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleExportPrivateKey}
                      disabled={isExporting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    >
                      {isExporting ? (
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
                          <Key className="w-4 h-4" />
                          Export Private Key First
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleProceedToDelete}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/10 font-semibold py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Account Anyway
                      </div>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {step === "exported" && (
              <motion.div
                key="exported"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">
                        Private Key Export ready
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Copy your private key and save it in a secure location.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Your Private Key
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleProceedToDelete}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Proceed to Delete Account
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                        Final Confirmation Required
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        To confirm account deletion, type{" "}
                        <strong>"delete account"</strong> in the field below.
                        This action is irreversible and will permanently remove
                        all your data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Type "delete account" to confirm
                    </label>
                    <Input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="delete account"
                      className={`transition-all duration-200 ${
                        confirmText && !isConfirmValid
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                          : ""
                      }`}
                    />
                    {confirmText && !isConfirmValid && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Text must exactly match "delete account"
                      </motion.div>
                    )}
                    {isConfirmValid && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmation text is correct
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={!isConfirmValid || isDeleting}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3"
                    >
                      {isDeleting ? (
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
                          <Trash2 className="w-4 h-4" />
                          Delete Account Permanently
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
