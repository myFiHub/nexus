"use client";

// Usage example:
//
// import { buyOrSellPassDialog } from "app/components/Dialog";
// import { User } from "app/services/api/types";
//
// const handleBuyOrSellPass = async (user: User) => {
//   const result = await buyOrSellPassDialog({
//     user,
//     alreadyOwnedNumber: 2, // Number of passes user already owns
//     buyPrice: "0.1 APT",   // Price to buy a pass
//     sellPrice: "0.08 APT", // Optional: Price to sell a pass
//   });
//
//   switch (result) {
//     case "buy":
//       console.log("User wants to buy a pass");
//       // Handle buy logic
//       break;
//     case "sell":
//       console.log("User wants to sell a pass");
//       // Handle sell logic
//       break;
//     case undefined:
//       console.log("User cancelled the dialog");
//       break;
//   }
// };

import { User } from "app/services/api/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dialog/index";
import { Img } from "../../../components/Img";

interface BuyOrSellPassDialogProps {
  user: User;
  alreadyOwnedNumber: number;
  buyPrice: string;
  sellPrice?: string;
}

export type BuyOrSellPassDialogResult = "buy" | "sell" | undefined;

let resolvePromise: ((value: BuyOrSellPassDialogResult) => void) | null = null;

export const buyOrSellPassDialog = ({
  user,
  alreadyOwnedNumber,
  buyPrice,
  sellPrice,
}: BuyOrSellPassDialogProps): Promise<BuyOrSellPassDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-buy-or-sell-pass-dialog", {
      detail: {
        user,
        alreadyOwnedNumber,
        buyPrice,
        sellPrice,
      },
    });
    window.dispatchEvent(event);
  });
};

export const BuyOrSellPassDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<BuyOrSellPassDialogProps | null>(null);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<BuyOrSellPassDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-buy-or-sell-pass-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-buy-or-sell-pass-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleBuy = () => {
    setIsOpen(false);
    resolvePromise?.("buy");
    resolvePromise = null;
  };

  const handleSell = () => {
    setIsOpen(false);
    resolvePromise?.("sell");
    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
  };

  const hasPasses =
    dialogContent?.alreadyOwnedNumber && dialogContent.alreadyOwnedNumber > 0;
  const canSell = hasPasses && dialogContent?.sellPrice;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {hasPasses ? "Buy or Sell Pass" : "Buy Pass"}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4 py-4"
        >
          {/* User Info */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="relative">
              <Img
                src={dialogContent?.user.image || "/logo.png"}
                alt={dialogContent?.user.name || "User"}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">
                  {dialogContent?.alreadyOwnedNumber || 0}
                </span>
              </motion.div>
            </div>
            <h3 className="font-semibold text-lg">
              {dialogContent?.user.name || "Unknown User"}
            </h3>
          </motion.div>

          {/* Pass Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-center space-y-2"
          >
            {hasPasses ? (
              <p className="text-sm text-muted-foreground">
                You own{" "}
                <span className="font-semibold text-primary">
                  {dialogContent?.alreadyOwnedNumber}
                </span>{" "}
                pass{dialogContent?.alreadyOwnedNumber === 1 ? "" : "es"} from
                this user
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You don't own any passes from this user yet
              </p>
            )}
          </motion.div>

          {/* Price Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="w-full space-y-2"
          >
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Buy Price:</span>
                <span className="text-sm font-semibold text-primary">
                  {dialogContent?.buyPrice} MOVE
                </span>
              </div>
              {canSell ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sell Price:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {dialogContent?.sellPrice} MOVE
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </motion.div>
        </motion.div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <AnimatePresence>
            {/* Buy Button - Always shown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="w-full sm:w-auto"
            >
              <Button onClick={handleBuy} className="w-full sm:w-auto">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  Buy Pass ({dialogContent?.buyPrice} MOVE)
                </motion.span>
              </Button>
            </motion.div>

            {/* Sell Button - Only shown if user has passes and sell price is available */}
            {canSell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={handleSell}
                  className="w-full sm:w-auto"
                  variant="outline"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    Sell Pass ({dialogContent?.sellPrice} MOVE)
                  </motion.span>
                </Button>
              </motion.div>
            )}

            {/* Cancel Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={handleCancel}
                className="w-full sm:w-auto"
                variant="ghost"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  Cancel
                </motion.span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
