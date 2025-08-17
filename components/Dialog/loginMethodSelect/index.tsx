"use client";

import { RazorConnectButton } from "app/containers/_externalWallets/connectors/razor";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useIsMobile } from "app/hooks/use-mobile";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../index";
import AnimatedLoginOption from "./AnimatedLoginOption";
import { containerVariants, itemVariants } from "./variants";

export enum LoginMethod {
  SOCIAL = "social",
  NIGHTLY = "Nightly",
  OKX = "OKX Wallet",
}

export const isNetworkValidForExternalWalletLogin = (chainId: number) => {
  return chainId === 126;
};

export const isExternalWalletLoginMethod = (loginMethod: string) => {
  return (
    loginMethod?.toLowerCase().includes("nightly") ||
    loginMethod?.toLowerCase().includes("okx") ||
    loginMethod?.toLowerCase().includes("razor") ||
    loginMethod?.toLowerCase().includes("leap") ||
    loginMethod?.toLowerCase().includes("bitget")
  );
};

export type validWalletNames = LoginMethod.NIGHTLY | LoginMethod.OKX;

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
  const isMobile = useIsMobile();
  const logingIn = useSelector(GlobalSelectors.logingIn);

  useEffect(() => {
    if (isMobile) {
      resolvePromise?.(LoginMethod.SOCIAL);
      return;
    }
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
    resolvePromise?.(method);
    resolvePromise = null;
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  const handleRazorConnect = (walletName: string) => {
    resolvePromise?.(walletName as validWalletNames);
    resolvePromise = null;
  };

  return (
    <Dialog
      open={isOpen && !logingIn}
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
            <AnimatedLoginOption
              imagePaths={[
                "/social_login_icons/g_icon.png",
                "/social_login_icons/x_platform.png",
                "/social_login_icons/apple.png",
                "/social_login_icons/email.png",
                "/social_login_icons/facebook.png",
                "/social_login_icons/github.png",
              ]}
              title="Social Login"
              subtitle="Connect with Google, Twitter, Email, linkedIn..."
              onClick={() => handleSelect(LoginMethod.SOCIAL)}
            />
            <RazorConnectButton
              onConnect={handleRazorConnect}
              onModalOpenChange={() => {}}
            />
            {/* Nightly Wallet Option */}
            {/* <motion.div
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
            </motion.div> */}

            {/* OKX Wallet Option */}
            {/* <motion.div
              variants={optionVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSelect(LoginMethod.OKX)}
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
                        src="/okx_logo.png"
                        alt="OKX Wallet"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      OKX Wallet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with your OKX wallet
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
            </motion.div> */}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export const LoginMethodSelectDialogProvider = () => {
  const myUsername = useSelector(GlobalSelectors.podiumUserInfo);
  if (myUsername) {
    return null;
  }
  return <Content />;
};
