"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index";

export enum LoginMethod {
  SOCIAL = "social",
  NIGHTLY = "Nightly",
}

export const isExternalWalletLoginMethod = (loginMethod: string) => {
  return loginMethod?.toLowerCase() === LoginMethod.NIGHTLY.toLowerCase();
};

export type validWalletNames = LoginMethod.NIGHTLY;

export type LoginMethodSelectDialogResult = LoginMethod | undefined;

let resolvePromise: ((value: LoginMethodSelectDialogResult) => void) | null =
  null;

export const loginMethodSelectDialog =
  (): Promise<LoginMethodSelectDialogResult> => {
    return new Promise((resolve) => {
      resolvePromise = resolve;

      const event = new CustomEvent("show-login-method-select-dialog");
      window.dispatchEvent(event);
    });
  };

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "show-login-method-select-dialog",
      handleShowDialog
    );
    return () => {
      window.removeEventListener(
        "show-login-method-select-dialog",
        handleShowDialog
      );
    };
  }, []);

  const handleSelect = (method: LoginMethod) => {
    setIsOpen(false);
    resolvePromise?.(method);
    resolvePromise = null;
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
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
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const optionVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
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
        duration: 0.5,
        ease: "backOut" as const,
        delay: 0.2,
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 0 0 hsl(var(--primary) / 0.4)",
        "0 0 0 8px hsl(var(--primary) / 0)",
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
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="max-w-sm w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] mx-auto overflow-hidden p-6"
        showCloseButton={false}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative"
        >
          {/* Animated background gradient */}
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
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <DialogHeader className="relative z-10 pb-6">
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Choose Login Method
              </DialogTitle>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-center text-muted-foreground text-sm mt-2"
            >
              Select how you'd like to connect to your account
            </motion.p>
          </DialogHeader>

          <motion.div
            variants={itemVariants}
            className="space-y-4 relative z-10"
          >
            {/* Social Login Option */}
            <motion.div
              variants={optionVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSelect(LoginMethod.SOCIAL)}
              className="group cursor-pointer"
            >
              <motion.div
                className="relative p-6 bg-card/50 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200"
                whileHover={{
                  backgroundColor: "hsl(var(--card) / 0.8)",
                }}
              >
                <motion.div
                  variants={glowVariants}
                  animate="animate"
                  className="absolute inset-0 rounded-lg pointer-events-none"
                />

                <div className="flex items-center space-x-4">
                  <motion.div variants={iconVariants} className="relative">
                    <div className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                      <div className="relative w-12 h-12">
                        {(() => {
                          const icons = [
                            "/social_login_icons/g_icon.png",
                            "/social_login_icons/x_platform.png",
                            "/social_login_icons/apple.png",
                            "/social_login_icons/email.png",
                            "/social_login_icons/facebook.png",
                            "/social_login_icons/github.png",
                          ];
                          const loopIcons = [...icons, ...icons]; // duplicate for seamless loop
                          const rowGapPx = 6;
                          const iconSizePx = 16;
                          const rowHeightPx = iconSizePx + rowGapPx; // vertical space per icon
                          const trackHeightPx = rowHeightPx * icons.length;
                          const durationSeconds = 10; // overall scroll duration

                          return (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="relative h-6 w-6 overflow-hidden">
                                {/* top/bottom fade masks */}
                                <div className="pointer-events-none absolute left-0 right-0 top-0 h-2 bg-gradient-to-b from-background to-transparent" />
                                <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-t from-background to-transparent" />

                                <motion.div
                                  className="flex flex-col items-center"
                                  animate={{ y: [0, -trackHeightPx] }}
                                  transition={{
                                    duration: durationSeconds,
                                    ease: "linear" as const,
                                    repeat: Infinity,
                                  }}
                                >
                                  {loopIcons.map((src, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-center"
                                      style={{ height: rowHeightPx }}
                                    >
                                      {(() => {
                                        const needsMask =
                                          src.includes("apple") ||
                                          src.includes("x_platform");
                                        if (needsMask) {
                                          return (
                                            <div
                                              aria-label="Social login"
                                              className="w-4 h-4"
                                              style={{
                                                backgroundColor: "#ffffff",
                                                WebkitMaskImage: `url(${src})`,
                                                maskImage: `url(${src})`,
                                                WebkitMaskRepeat: "no-repeat",
                                                maskRepeat: "no-repeat",
                                                WebkitMaskSize: "contain",
                                                maskSize: "contain",
                                                WebkitMaskPosition: "center",
                                                maskPosition: "center",
                                                width: iconSizePx,
                                                height: iconSizePx,
                                              }}
                                            />
                                          );
                                        }
                                        return (
                                          <Image
                                            src={src}
                                            alt="Social login"
                                            width={iconSizePx}
                                            height={iconSizePx}
                                            className="w-4 h-4"
                                          />
                                        );
                                      })()}
                                    </div>
                                  ))}
                                </motion.div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Social Login
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with Google, Twitter, Email, linkedIn...
                    </p>
                  </div>

                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Nightly Wallet Option */}
            <motion.div
              variants={optionVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSelect(LoginMethod.NIGHTLY)}
              className="group cursor-pointer"
            >
              <motion.div
                className="relative p-6 bg-card/50 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200"
                whileHover={{
                  backgroundColor: "hsl(var(--card) / 0.8)",
                }}
              >
                <motion.div
                  variants={glowVariants}
                  animate="animate"
                  className="absolute inset-0 rounded-lg pointer-events-none"
                />

                <div className="flex items-center space-x-4">
                  <motion.div variants={iconVariants} className="relative">
                    <div className="group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                      <Image
                        src="/nightly_logo.webp"
                        alt="Nightly Wallet"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Nightly Wallet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with your Nightly wallet
                    </p>
                  </div>

                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export const LoginMethodSelectDialogProvider = () => {
  return <Content />;
};
