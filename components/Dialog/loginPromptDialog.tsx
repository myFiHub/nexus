"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { isDev } from "app/lib/utils";
import { motion } from "framer-motion";
import { Lock, LogIn, Shield, Sparkles, Zap } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface LoginPromptDialogProps {
  actionDescription: string;
  additionalComponent?: ReactNode;
  action: () => void | Promise<any>;
}

export type LoginPromptDialogResult = {
  loggedIn: boolean;
};

let resolvePromise: ((value: LoginPromptDialogResult) => void) | null = null;

export const loginPromptDialog = ({
  actionDescription,
  additionalComponent,
  action,
}: LoginPromptDialogProps): Promise<LoginPromptDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-login-prompt-dialog", {
      detail: {
        actionDescription,
        additionalComponent,
        action,
      },
    });
    window.dispatchEvent(event);
  });
};

const Content = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<LoginPromptDialogProps | null>(null);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const logingIn = useSelector(GlobalSelectors.logingIn);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<LoginPromptDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-login-prompt-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-login-prompt-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && isOpen) {
      handleLoginSuccess();
    }
  }, [isLoggedIn, isOpen]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    dispatch(globalActions.getAndSetWeb3AuthAccount());
  };

  const handleLoginSuccess = async () => {
    setIsLoggingIn(false);
    setIsOpen(false);

    if (dialogContent?.action) {
      try {
        if (isDev) {
          console.log(
            "running action . . .~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
          );
        }
        await dialogContent.action();
        resolvePromise?.({ loggedIn: true });
      } catch (error) {
        console.error("Action failed after login:", error);
        resolvePromise?.({ loggedIn: false });
      }
    } else {
      resolvePromise?.({ loggedIn: true });
    }

    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsLoggingIn(false); // Reset the logging in state
    resolvePromise?.({ loggedIn: false });
    resolvePromise = null;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeIn" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const iconVariants = {
    hidden: { rotate: -180, scale: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "backOut" as const,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 hsl(var(--primary) / 0.4)",
        "0 0 0 10px hsl(var(--primary) / 0)",
        "0 0 0 0 hsl(var(--primary) / 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <Dialog
      open={isOpen}
      modal={false} // Always non-modal to prevent interference with Web3Auth
      onOpenChange={(open) => {
        if (!open && !logingIn) {
          // Only allow closing if Web3Auth is not active
          handleCancel();
        }
      }}
    >
      <DialogContent
        className="max-w-md w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] md:max-w-md mx-auto overflow-hidden login-prompt-dialog-active p-4 sm:p-6" // Responsive width and padding
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative"
        >
          {/* Animated background gradient - theme aware */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-background via-muted to-accent/20 rounded-lg"
            animate={{
              background: [
                "linear-gradient(45deg, hsl(var(--background)), hsl(var(--muted)), hsl(var(--accent) / 0.2))",
                "linear-gradient(45deg, hsl(var(--accent) / 0.2), hsl(var(--background)), hsl(var(--muted)))",
                "linear-gradient(45deg, hsl(var(--muted)), hsl(var(--accent) / 0.2), hsl(var(--background)))",
                "linear-gradient(45deg, hsl(var(--background)), hsl(var(--muted)), hsl(var(--accent) / 0.2))",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating sparkles - hidden on mobile for cleaner look */}
          <motion.div
            variants={sparkleVariants}
            animate="animate"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 hidden sm:block"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
          </motion.div>
          <motion.div
            variants={sparkleVariants}
            animate="animate"
            className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 hidden sm:block"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
          </motion.div>

          <DialogHeader className="relative z-10 pb-4 sm:pb-6">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-3 sm:mb-4"
            >
              <motion.div variants={iconVariants} className="relative">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="absolute inset-0 bg-primary rounded-full opacity-20"
                />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-3 sm:p-4 rounded-full">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <DialogTitle className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2">
                Login Required
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <motion.div
            variants={itemVariants}
            className="py-4 sm:py-6 relative z-10"
          >
            <div className="text-center space-y-3 sm:space-y-4">
              <motion.p
                variants={itemVariants}
                className="text-foreground leading-relaxed text-sm sm:text-base px-2"
              >
                To{" "}
                <span className="font-semibold text-primary">
                  {dialogContent?.actionDescription}
                </span>
                , you need to be logged in.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground px-2"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-center">
                  Secure authentication with Web3Auth
                </span>
              </motion.div>

              {dialogContent?.additionalComponent && (
                <motion.div
                  variants={itemVariants}
                  className="mt-3 sm:mt-4 p-3 sm:p-4 bg-card/50 rounded-lg border border-border mx-2"
                >
                  {dialogContent.additionalComponent}
                </motion.div>
              )}
            </div>
          </motion.div>

          <DialogFooter className="relative z-10 pt-4 sm:pt-6">
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 w-full"
            >
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="flex-1 order-2 sm:order-1 text-sm sm:text-base py-2 sm:py-2.5"
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 order-1 sm:order-2"
              >
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn || logingIn}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold relative overflow-hidden text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-foreground/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
                    {logingIn ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.div>
                        <span className="whitespace-nowrap">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">
                          Login And Continue
                        </span>
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export const LoginPromptDialogProvider = () => {
  return <Content />;
};
