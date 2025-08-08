"use client";

import { Loader } from "app/components/Loader";
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
  const [isHovered, setIsHovered] = useState(false);
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
    dispatch(globalActions.login());
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
        !loading && "relative overflow-hidden"
      )}
      onClick={isLoggedIn ? disconnect : connect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.4) 50%, transparent 75%)",
              borderRadius: "inherit",
            }}
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Non-fancy button hover shine effect */}
      {!fancy && !loading && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.2) 50%, transparent 75%)",
            }}
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "100%" } : { x: "-100%" }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}

      <span className="relative z-10">
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
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
            className="absolute inset-0 rounded-xl -z-10"
          />

          {/* Static button - no rotation! */}
          {buttonContent}

          {/* Individual orbiting sparkles */}
          {/* Sparkle 1 */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [0.3, 0.8, 0.3],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              transformOrigin: "0 -28px",
            }}
          >
            <div className="w-0.5 h-0.5 bg-blue-300/80 rounded-full" />
          </motion.div>

          {/* Sparkle 2 */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [0.3, 0.8, 0.3],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 2,
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              transformOrigin: "28px 0",
            }}
          >
            <div className="w-0.5 h-0.5 bg-purple-300/80 rounded-full" />
          </motion.div>

          {/* Sparkle 3 */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [0.3, 0.8, 0.3],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 4,
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              transformOrigin: "0 28px",
            }}
          >
            <div className="w-0.5 h-0.5 bg-blue-300/80 rounded-full" />
          </motion.div>

          {/* Sparkle 4 */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [0.3, 0.8, 0.3],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 6,
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              transformOrigin: "-28px 0",
            }}
          >
            <div className="w-0.5 h-0.5 bg-purple-300/80 rounded-full" />
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
