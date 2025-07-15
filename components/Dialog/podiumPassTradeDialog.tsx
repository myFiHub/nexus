"use client";

// Usage example:
//
// import { podiumPassTradeDialog } from "app/components/Dialog";
// import { User } from "app/services/api/types";
//
// // Basic usage - will fetch price and owned number
// const handleTradePass = async () => {
//   const result = await podiumPassTradeDialog({
//     type: "buy", // or "sell"
//     sellerUser: user,
//   });
//
//   if (result?.confirmed) {
//     console.log("User confirmed the trade");
//     // Handle the trade logic
//   }
// };
//
// // Optimized usage - provide data to skip API calls
// const handleTradePassOptimized = async () => {
//   const result = await podiumPassTradeDialog({
//     type: "buy",
//     sellerUser: user,
//     price: 0.5, // Skip price fetching
//     ownedNumber: 2, // Skip owned number fetching
//     sellPrice: 0.4, // Skip sell price fetching (only for sell type)
//   });
//
//   if (result?.confirmed) {
//     console.log("User confirmed the trade");
//     // Handle the trade logic
//   }
// };

import { movementLogoUrl } from "app/lib/constants";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { getStore } from "app/store";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { Img } from "../Img";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  loginPromptDialog,
} from "./index";

interface PodiumPassTradeDialogProps {
  type: "buy" | "sell";
  sellerUser: User;
  price?: number; // Optional: if provided, skip price fetching
  ownedNumber?: number; // Optional: if provided, skip owned number fetching
  sellPrice?: number; // Optional: if provided, skip sell price fetching
}

export type PodiumPassTradeDialogResult =
  | {
      confirmed: boolean;
      price?: number;
      ownedNumber?: number;
    }
  | undefined;

let resolvePromise: ((value: PodiumPassTradeDialogResult) => void) | null =
  null;

export const podiumPassTradeDialog = async ({
  type,
  sellerUser,
  price,
  ownedNumber,
  sellPrice,
}: PodiumPassTradeDialogProps): Promise<PodiumPassTradeDialogResult> => {
  const store = getStore();
  const myUser = store.getState().global.podiumUserInfo;
  if (!myUser?.uuid) {
    const res = await loginPromptDialog({
      actionDescription: "Login to buy pass",
      action: () => {},
    });
    if (!res?.loggedIn) {
      return;
    } else {
      return podiumPassTradeDialog({
        type,
        sellerUser,
        price,
        ownedNumber,
        sellPrice,
      });
    }
  }

  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-podium-pass-trade-dialog", {
      detail: {
        type,
        sellerUser,
        price,
        ownedNumber,
        sellPrice,
      },
    });
    window.dispatchEvent(event);
  });
};

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<PodiumPassTradeDialogProps | null>(null);
  const [passData, setPassData] = useState<{
    ownedNumber: number;
    price: number;
    sellPrice?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleShowDialog = (
      event: CustomEvent<PodiumPassTradeDialogProps>
    ) => {
      setDialogContent(event.detail);
      setIsOpen(true);
      fetchPassData(event.detail);
    };

    window.addEventListener(
      "show-podium-pass-trade-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-podium-pass-trade-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const fetchPassData = async (content: PodiumPassTradeDialogProps) => {
    // Check if we need to make any API calls
    const needsOwnedNumberFetch = content.ownedNumber === undefined;
    const needsPriceFetch = content.price === undefined;
    const needsSellPriceFetch =
      content.type === "sell" && content.sellPrice === undefined;

    // Only show loading if we need to fetch data
    if (needsOwnedNumberFetch || needsPriceFetch || needsSellPriceFetch) {
      console.log("Setting loading to true - API calls needed");
      setIsLoading(true);
    } else {
      console.log("Skipping loading - all data provided");
      setIsLoading(false);
    }
    setError(null);

    try {
      const store = getStore();
      const myUser = store.getState().global.podiumUserInfo;
      // Use provided data or fetch from API
      let ownedNumber: number | null = null;
      let price: number | null = null;

      // Check if we need to fetch owned number
      if (content.ownedNumber !== undefined) {
        ownedNumber = content.ownedNumber;
      } else {
        const res = await movementService.getMyBalanceOnPodiumPass({
          myAddress: myUser!.aptos_address!,
          sellerAddress: content.sellerUser.aptos_address!,
        });
        ownedNumber = bigIntCoinToMoveOnAptos(res || BigInt(0));
      }

      // Check if we need to fetch price
      if (content.price !== undefined) {
        price = content.price;
      } else {
        price = await movementService.getPodiumPassPrice({
          sellerAddress: content.sellerUser.aptos_address!,
          numberOfTickets: 1,
        });
      }

      let sellPrice: number | undefined;
      // Only fetch sell price if type is "sell" and we don't have it provided
      if (content.type === "sell" && ownedNumber && ownedNumber > BigInt(0)) {
        if (content.sellPrice !== undefined) {
          sellPrice = content.sellPrice;
        } else {
          const sellPriceBigInt =
            await movementService.getSellPriceForPodiumPass({
              sellerAddress: content.sellerUser.aptos_address!,
              numberOfTickets: 1,
            });
          sellPrice = sellPriceBigInt
            ? bigIntCoinToMoveOnAptos(sellPriceBigInt)
            : undefined;
        }
      }

      setPassData({
        ownedNumber: Number(ownedNumber || BigInt(0)),
        price: price || 0,
        sellPrice,
      });
    } catch (err) {
      setError("Failed to fetch pass data. Please try again.");
      console.error("Error fetching pass data:", err);
    } finally {
      if (needsOwnedNumberFetch || needsPriceFetch || needsSellPriceFetch) {
        setIsLoading(false);
      }
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({
      confirmed: true,
      price: passData?.price,
      ownedNumber: passData?.ownedNumber,
    });
    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
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
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
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

  const shimmerVariants = {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const isMakeTradeDisabled =
    (passData?.ownedNumber ?? 0) == 0 && dialogContent?.type == "sell";
  const isBuyingFirstTime =
    (passData?.ownedNumber ?? 0) == 0 &&
    dialogContent?.type == "buy" &&
    !isLoading;

  const sellingWithNoPass =
    (passData?.ownedNumber ?? 0) == 0 &&
    dialogContent?.type == "sell" &&
    !isLoading;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="max-w-md w-full min-w-0 max-w-full mx-auto overflow-x-hidden p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
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
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Floating sparkles */}
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

          <DialogHeader className="relative z-10 pb-3 sm:pb-4">
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-3 sm:mb-4"
            >
              <motion.div variants={cardVariants} className="relative">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                  className="absolute inset-0 bg-primary rounded-full opacity-20"
                />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-3 sm:p-4 rounded-full">
                  {dialogContent?.type === "buy" ? (
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  ) : (
                    <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                  )}
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <DialogTitle className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2">
                {dialogContent?.type === "buy"
                  ? "Buy Podium Pass"
                  : "Sell Podium Pass"}
              </DialogTitle>
              {isBuyingFirstTime && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-sm text-green-600 font-medium mt-2"
                >
                  🎉 First time buying from this creator!
                </motion.p>
              )}
            </motion.div>
          </DialogHeader>

          <motion.div
            variants={itemVariants}
            className="py-4 sm:py-6 relative z-10"
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-center text-muted-foreground">
                  Loading pass data...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-4"
              >
                <XCircle className="w-12 h-12 text-destructive" />
                <p className="text-center text-destructive">{error}</p>
                <Button
                  onClick={() => dialogContent && fetchPassData(dialogContent)}
                  variant="outline"
                >
                  Retry
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* User Card - Inspired by UserInfoDisplay */}
                <motion.div
                  variants={cardVariants}
                  className={`bg-card/80 backdrop-blur-sm rounded-xl border p-3 sm:p-6 shadow-lg relative overflow-x-hidden w-full max-w-full min-w-0 ${
                    isBuyingFirstTime
                      ? "border-green-500/50 bg-green-50/20 dark:bg-green-950/20"
                      : "border-border/50"
                  }`}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    variants={shimmerVariants}
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                  />

                  <div className="relative z-10 w-full max-w-full min-w-0 overflow-x-hidden">
                    <div className="flex flex-nowrap items-center gap-3 sm:gap-4 min-w-0 w-full max-w-full overflow-x-hidden">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="relative flex-shrink-0 min-w-[3.5rem] sm:min-w-[5rem]"
                      >
                        <Img
                          src={dialogContent?.sellerUser.image || "/logo.png"}
                          alt={dialogContent?.sellerUser.name || "User"}
                          useImgTag
                          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/50 min-w-0"
                        />
                        {passData?.ownedNumber && passData.ownedNumber > 0 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.4,
                              type: "spring",
                              stiffness: 200,
                            }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background"
                          >
                            <span className="text-white text-xs font-bold">
                              {passData.ownedNumber}
                            </span>
                          </motion.div>
                        ) : (
                          <></>
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0 max-w-full overflow-x-hidden">
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="font-semibold text-base sm:text-xl text-foreground truncate max-w-full min-w-0"
                          style={{ minWidth: 0 }}
                        >
                          {dialogContent?.sellerUser.name || "Unknown User"}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-xs sm:text-sm text-muted-foreground font-mono truncate max-w-full min-w-0"
                          style={{ minWidth: 0 }}
                        >
                          {dialogContent?.sellerUser.aptos_address?.slice(0, 8)}
                          ...
                          {dialogContent?.sellerUser.aptos_address?.slice(-6)}
                        </motion.p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="flex items-center gap-2 bg-primary/10 rounded-lg px-2 py-1 flex-shrink-0 min-w-0 overflow-x-hidden"
                        style={{ minWidth: 0 }}
                      >
                        <Img
                          src={movementLogoUrl}
                          alt="MOVE"
                          className="w-4 h-4 flex-shrink-0"
                        />
                        <span
                          className="text-xs sm:text-sm font-semibold text-primary truncate max-w-[5.5rem] sm:max-w-[7rem] min-w-0"
                          style={{ minWidth: 0 }}
                        >
                          {passData?.price || 0} MOVE
                        </span>
                      </motion.div>
                    </div>

                    {/* Pass Status */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {passData?.ownedNumber && passData.ownedNumber > 0 ? (
                            <Shield className="w-4 h-4 text-green-600" />
                          ) : dialogContent?.type === "buy" ? (
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Shield className="w-4 h-4 text-amber-600" />
                            </motion.div>
                          ) : (
                            <Shield className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm ${
                              passData?.ownedNumber && passData.ownedNumber > 0
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          >
                            {passData?.ownedNumber && passData.ownedNumber > 0
                              ? `You own ${passData.ownedNumber} pass${
                                  passData.ownedNumber === 1 ? "" : "es"
                                }`
                              : dialogContent?.type === "buy"
                              ? "Ready to become a pass holder! 🚀"
                              : "No passes available to sell"}
                          </span>
                        </div>
                        {passData?.ownedNumber && passData.ownedNumber > 0 ? (
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">
                              Pass Holder
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Trade Details */}
                {!sellingWithNoPass ? (
                  <motion.div
                    variants={itemVariants}
                    className="bg-muted/50 rounded-lg p-4 border border-border/30"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {dialogContent?.type === "buy"
                            ? "Buy Price:"
                            : "Sell Price:"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Img
                            src={movementLogoUrl}
                            alt="MOVE"
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-lg font-bold text-primary">
                            {dialogContent?.type === "buy"
                              ? passData?.price || 0
                              : passData?.sellPrice || 0}{" "}
                            MOVE
                          </span>
                        </div>
                      </div>

                      {dialogContent?.type === "sell" &&
                        passData?.sellPrice && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Current Buy Price:
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {passData.price} MOVE
                            </span>
                          </div>
                        )}

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Zap className="w-3 h-3" />
                        <span>Secure transaction on Movement Network</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>
            )}
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
                {sellingWithNoPass ? "Close" : "Cancel"}
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 order-1 sm:order-2"
              >
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || !!error || isMakeTradeDisabled}
                  className={`w-full font-semibold relative overflow-hidden text-sm sm:text-base py-2 sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoading || !!error || isMakeTradeDisabled
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : dialogContent?.type === "sell"
                      ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                      : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                  }`}
                >
                  {!isLoading && !error && !isMakeTradeDisabled && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        dialogContent?.type === "sell"
                          ? "from-white/20 to-transparent"
                          : "from-primary-foreground/20 to-transparent"
                      }`}
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
                    {dialogContent?.type === "buy" ? (
                      <>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">
                          {isBuyingFirstTime ? "Buy First Pass" : "Buy Pass"}
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">Sell Pass</span>
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

export const PodiumPassTradeDialogProvider = () => {
  return <Content />;
};
