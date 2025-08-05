"use client";

// Usage example:
//
// import { loginSelectionDialog } from "app/components/Dialog";
//
// const handleLoginSelection = async () => {
//   const result = await loginSelectionDialog();
//
//   if (result) {
//     console.log("Selected login method:", result);
//     // Handle login based on result
//   }
// };

import { Img } from "app/components/Img";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index";

export enum LoginMethod {
  SOCIAL = "social",
  NIGHTLY = "nightly",
}

let resolvePromise: ((value: LoginMethod | undefined) => void) | null = null;

export const loginSelectionDialog = (): Promise<LoginMethod | undefined> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-login-selection-dialog");
    window.dispatchEvent(event);
  });
};

export const LoginSelectionDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod | null>(
    null
  );

  useEffect(() => {
    const handleShowDialog = () => {
      setSelectedMethod(null);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-login-selection-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-login-selection-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleMethodSelect = (method: LoginMethod) => {
    setIsOpen(false);
    resolvePromise?.(method);
    resolvePromise = null;
    setSelectedMethod(null);
  };

  const loginOptions = [
    {
      method: LoginMethod.SOCIAL,
      title: "Social Login",
      description:
        "Sign in with Google, Twitter, GitHub, or other social accounts",
      icon: <Globe className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      method: LoginMethod.NIGHTLY,
      title: "Nightly Wallet",
      description: "Connect with your Nightly wallet for Web3 authentication",
      icon: (
        <div className="w-6 h-6 relative">
          <Img
            src="/nightly-logo.webp"
            alt="Nightly Wallet"
            width={24}
            height={24}
            className="w-6 h-6"
            useImgTag
          />
        </div>
      ),
      color: "from-orange-500 to-red-600",
      bgColor:
        "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
          resolvePromise?.(undefined);
          resolvePromise = null;
          setSelectedMethod(null);
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-xl font-bold">
              Choose Login Method
            </DialogTitle>
            <p className="text-muted-foreground mt-2 text-sm">
              Select how you'd like to sign in to your account:
            </p>
          </motion.div>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          <AnimatePresence>
            {loginOptions.map((option, index) => {
              const isSelected = selectedMethod === option.method;

              return (
                <motion.div
                  key={option.method}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleMethodSelect(option.method)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `${option.borderColor} ${option.bgColor} shadow-lg`
                        : "border-border hover:border-muted-foreground/30 bg-background hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex  space-x-4 items-center">
                      <motion.div
                        className={`p-2 rounded-lg bg-gradient-to-br ${option.color} text-white`}
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {option.icon}
                      </motion.div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {option.title}
                          </h3>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-1 rounded-full bg-green-500 text-white"
                              >
                                <Check className="w-3 h-3" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
