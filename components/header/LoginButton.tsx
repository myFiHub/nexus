"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { cn, truncate } from "app/lib/utils";
import { ReduxProvider } from "app/store/Provider";
import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import { logoutDialog } from "../Dialog";
import { Img } from "../Img";

interface LoginButtonProps {
  size?: "sm" | "lg";
  className?: string;
  fancy?: boolean;
}

export const LoginButton = ({ size, className, fancy }: LoginButtonProps) => {
  return (
    <ReduxProvider>
      <Content size={size} className={className} fancy={fancy} />
    </ReduxProvider>
  );
};

const Content = ({ size, className, fancy }: LoginButtonProps) => {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const podiumUserInfo = useSelector(GlobalSelectors.podiumUserInfo);
  const initializingWeb3Auth = useSelector(
    GlobalSelectors.initializingWeb3Auth
  );
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const logingOut = useSelector(GlobalSelectors.logingOut);
  const isPrimary = useSelector(GlobalSelectors.isPrimaryAccount);
  // Ensure loading is always a boolean to prevent hydration mismatch
  const loading = Boolean(logingIn || logingOut || initializingWeb3Auth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const connect = async () => {
    dispatch(globalActions.getAndSetWeb3AuthAccount());
  };

  const disconnect = async () => {
    const result = await logoutDialog();
    if (result) {
      dispatch(globalActions.logout());
    }
  };

  const minWidth = size === "sm" ? "min-w-[100px]" : "min-w-[162px]";

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button disabled={true} size={size} className={cn(className, minWidth)}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  const buttonContent = (
    <Button
      disabled={loading}
      size={size}
      className={cn(
        className,
        minWidth,
        fancy && !loading && "relative overflow-hidden"
      )}
      onClick={isLoggedIn ? disconnect : connect}
    >
      {fancy && !loading && (
        <>
          {/* Rotating light shadow */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 70%, rgba(255, 255, 255, 0.3), transparent 130%)",
              borderRadius: "inherit",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </>
      )}

      <span className="relative z-10">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isLoggedIn && podiumUserInfo?.aptos_address ? (
          <div className="flex items-center gap-2">
            {podiumUserInfo.image && (
              <Img
                src={podiumUserInfo.image}
                alt="profile"
                className="w-6 h-6 rounded-full"
                useImgTag
              />
            )}
            <span>{truncate(podiumUserInfo.aptos_address)}</span>
          </div>
        ) : (
          "Login"
        )}
      </span>
    </Button>
  );

  return (
    <div className="relative">
      {fancy && !loading ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative"
        >
          {/* Subtle shadow with animated offset - light source orbiting above button */}
          <motion.div
            animate={{
              boxShadow: [
                "3px -3px 12px 2px rgba(59, 130, 246, 0.25), 6px -6px 24px 4px rgba(147, 51, 234, 0.15)",
                "3px 3px 12px 2px rgba(59, 130, 246, 0.25), 6px 6px 24px 4px rgba(147, 51, 234, 0.15)",
                "-3px 3px 12px 2px rgba(59, 130, 246, 0.25), -6px 6px 24px 4px rgba(147, 51, 234, 0.15)",
                "-3px -3px 12px 2px rgba(59, 130, 246, 0.25), -6px -6px 24px 4px rgba(147, 51, 234, 0.15)",
                "3px -3px 12px 2px rgba(59, 130, 246, 0.25), 6px -6px 24px 4px rgba(147, 51, 234, 0.15)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-lg -z-10"
          />

          {/* Static button - no rotation! */}
          {buttonContent}

          {/* Rotating sparkles around the button */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top sparkle */}
            <motion.div
              animate={{
                scale: [0.3, 0.8, 0.3],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-0.5 h-0.5 bg-blue-300/80 rounded-full" />
            </motion.div>

            {/* Right sparkle */}
            <motion.div
              animate={{
                scale: [0.3, 0.8, 0.3],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-1/2 right-0 transform -translate-y-1/2"
            >
              <div className="w-0.5 h-0.5 bg-purple-300/80 rounded-full" />
            </motion.div>

            {/* Bottom sparkle */}
            <motion.div
              animate={{
                scale: [0.3, 0.8, 0.3],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-0.5 h-0.5 bg-blue-300/80 rounded-full" />
            </motion.div>

            {/* Left sparkle */}
            <motion.div
              animate={{
                scale: [0.3, 0.8, 0.3],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute top-1/2 left-0 transform -translate-y-1/2"
            >
              <div className="w-0.5 h-0.5 bg-purple-300/80 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        buttonContent
      )}

      {/* Primary account indicator */}
      {isLoggedIn && !loading && (
        <div className="absolute -top-1 -right-1">
          {isPrimary ? (
            <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          ) : (
            <div className="bg-red-500 text-white text-[6px] px-0.5 py-0.5 rounded text-center min-w-[55px]">
              Not Primary
            </div>
          )}
        </div>
      )}
    </div>
  );
};
