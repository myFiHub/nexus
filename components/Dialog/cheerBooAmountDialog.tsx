"use client";

/**
 * Cheer/Boo Amount Dialog Component
 *
 * Usage example:
 *
 * import { cheerBooAmountDialog } from "app/components/Dialog";
 *
 * const handleCheer = async (member: LiveMember) => {
 *   const amount = await cheerBooAmountDialog({
 *     cheer: true,
 *     member: member
 *   });
 *
 *   if (amount !== undefined) {
 *     // User confirmed with amount
 *     console.log(`Cheer amount: ${amount}`);
 *     // Proceed with cheer action
 *   } else {
 *     // User cancelled
 *     console.log("User cancelled");
 *   }
 * };
 *
 * const handleBoo = async (member: LiveMember) => {
 *   const amount = await cheerBooAmountDialog({
 *     cheer: false,
 *     member: member
 *   });
 *
 *   if (amount !== undefined) {
 *     // User confirmed with amount
 *     console.log(`Boo amount: ${amount}`);
 *     // Proceed with boo action
 *   } else {
 *     // User cancelled
 *     console.log("User cancelled");
 *   }
 * };
 */

import { AssetsSelectors } from "app/containers/_assets/selectore";
import { LiveMember } from "app/services/api/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BalanceDisplay from "../BalanceDisplay";
import { Button } from "../Button";
import { Img } from "../Img";
import { Input } from "../Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface CheerBooAmountDialogProps {
  cheer: boolean;
  member: LiveMember;
  isMe?: boolean;
}

export type CheerBooAmountDialogResult = number | undefined;

let resolvePromise: ((value: CheerBooAmountDialogResult) => void) | null = null;

export const cheerBooAmountDialog = ({
  cheer,
  member,
  isMe = false,
}: CheerBooAmountDialogProps): Promise<CheerBooAmountDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-cheer-boo-amount-dialog", {
      detail: {
        cheer,
        member,
        isMe,
      },
    });
    window.dispatchEvent(event);
  });
};

export const CheerBooAmountDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const balance = useSelector(AssetsSelectors.balance);
  const balanceValue = balance?.value;
  const [dialogContent, setDialogContent] =
    useState<CheerBooAmountDialogProps | null>(null);

  useEffect(() => {
    const handleShowDialog = (
      event: CustomEvent<CheerBooAmountDialogProps>
    ) => {
      setDialogContent(event.detail);
      setIsOpen(true);
      setInputValue("");
      setIsValid(false);
    };

    window.addEventListener(
      "show-cheer-boo-amount-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-cheer-boo-amount-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const validateInput = (value: string) => {
    const numValue = parseFloat(value);
    const balanceNum =
      typeof balanceValue === "number"
        ? balanceValue
        : parseFloat(balanceValue || "0");

    // Check if input is valid number and at least 0.1
    const isValidAmount =
      value.trim() !== "" && !isNaN(numValue) && numValue >= 0.1;

    // Check if user has sufficient balance
    const hasSufficientBalance = numValue <= balanceNum;

    return isValidAmount && hasSufficientBalance;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(validateInput(value));
  };

  const handleConfirm = () => {
    if (!isValid) {
      // Animate the confirm button back to dead state
      return;
    }

    const amount = parseFloat(inputValue);
    setIsOpen(false);
    resolvePromise?.(amount);
    resolvePromise = null;
    setInputValue("");
    setIsValid(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(undefined);
    resolvePromise = null;
    setInputValue("");
    setIsValid(false);
  };

  const actionType = dialogContent?.cheer ? "cheer" : "boo";
  const actionColor = dialogContent?.cheer ? "bg-green-500" : "bg-red-500";
  const actionText = dialogContent?.cheer ? "Cheer" : "Boo";
  const memberName = dialogContent?.member?.name || "User";
  const isSelfAction = dialogContent?.isMe || false;

  // Enhanced styling for different actions
  const getActionStyles = () => {
    if (dialogContent?.cheer) {
      return {
        iconBg: "bg-gradient-to-br from-green-400 to-green-600",
        iconGlow: "shadow-lg shadow-green-500/50",
        infoBg: "bg-green-50 dark:bg-green-950/20",
        infoBorder: "border-green-200 dark:border-green-800",
        infoText: "text-green-700 dark:text-green-300",
        buttonGlow: "shadow-lg shadow-green-500/30",
        pulseAnimation: "animate-pulse",
      };
    } else {
      return {
        iconBg: "bg-gradient-to-br from-red-500 to-red-700",
        iconGlow: "shadow-lg shadow-red-500/50",
        infoBg: "bg-red-50 dark:bg-red-950/20",
        infoBorder: "border-red-200 dark:border-red-800",
        infoText: "text-red-700 dark:text-red-300",
        buttonGlow: "shadow-lg shadow-red-500/30",
        pulseAnimation: "animate-pulse",
      };
    }
  };

  const styles = getActionStyles();

  // Get appropriate messaging based on action and self-targeting
  const getActionMessage = () => {
    if (isSelfAction) {
      if (dialogContent?.cheer) {
        return "Each 0.1 MOVE adds a minute to your own time";
      } else {
        return "Each 0.1 MOVE removes a minute from your own time";
      }
    } else {
      if (dialogContent?.cheer) {
        return `Each 0.1 MOVE adds a minute to ${memberName}'s time`;
      } else {
        return `Each 0.1 MOVE removes a minute from ${memberName}'s time`;
      }
    }
  };

  const getActionLabel = () => {
    if (isSelfAction) {
      return `How much MOVE would you like to send for this self-${actionType}?`;
    } else {
      return `How much MOVE would you like to send for this ${actionType}?`;
    }
  };

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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogTitle className="flex items-center gap-3">
              <motion.div
                className={`w-8 h-8 rounded-full ${styles.iconBg} ${styles.iconGlow} flex items-center justify-center`}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                whileHover={{
                  scale: 1.1,
                  rotate: dialogContent?.cheer ? 10 : -10,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.span
                  className="text-white text-lg font-bold"
                  animate={
                    dialogContent?.cheer
                      ? {
                          scale: [1, 1.2, 1],
                          transition: {
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 2,
                          },
                        }
                      : {
                          scale: [1, 0.8, 1],
                          transition: {
                            duration: 0.3,
                            repeat: Infinity,
                            repeatDelay: 1,
                          },
                        }
                  }
                >
                  <img
                    src={dialogContent?.cheer ? "/cheer.png" : "/boo.png"}
                    alt={dialogContent?.cheer ? "Cheer" : "Boo"}
                    className={`w-5 h-5 filter brightness-0 invert drop-shadow-lg ${
                      dialogContent?.cheer
                        ? "drop-shadow-green-500/50"
                        : "drop-shadow-red-500/50"
                    }`}
                    style={{
                      filter: dialogContent?.cheer
                        ? "brightness(0) invert(1) drop-shadow(0 4px 8px rgba(34, 197, 94, 0.5))"
                        : "brightness(0) invert(1) drop-shadow(0 4px 8px rgba(239, 68, 68, 0.5))",
                    }}
                  />
                </motion.span>
              </motion.div>
              <div className="flex items-center gap-2">
                {dialogContent?.member?.image && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Img
                      src={dialogContent.member.image}
                      alt={memberName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                  </motion.div>
                )}
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {actionText} {memberName}
                </motion.span>
              </div>
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="py-4 space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div
            className={`${styles.infoBg} p-4 rounded-lg border ${styles.infoBorder}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.p
              className={`text-sm ${styles.infoText}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {getActionMessage()}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 ">
              <span className="text-sm font-medium text-muted-foreground pb-[10px]">
                Your Balance:
              </span>
              <BalanceDisplay
                className="text-[12px] font-medium text-muted-foreground"
                loadingClassName="h-4 w-16 bg-muted animate-pulse rounded mx-auto"
              />
            </div>
            <motion.label
              className="block text-sm font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {getActionLabel()}
            </motion.label>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.1"
                value={inputValue}
                onChange={handleInputChange}
                className={`text-center text-lg font-semibold [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
                  dialogContent?.cheer
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                    : "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {!isValid && inputValue.trim() !== "" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <motion.p
                  className="text-red-500 text-sm"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const numValue = parseFloat(inputValue);
                    const balanceNum =
                      typeof balanceValue === "number"
                        ? balanceValue
                        : parseFloat(balanceValue || "0");

                    if (isNaN(numValue) || numValue < 0.1) {
                      return "Please enter a valid amount of at least 0.1 MOVE";
                    } else if (numValue > balanceNum) {
                      return `Insufficient balance. You have ${balanceNum.toFixed(
                        2
                      )} MOVE available`;
                    } else {
                      return "Please enter a valid amount";
                    }
                  })()}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <DialogFooter>
          <motion.div
            className="flex gap-2 w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.div className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  className="w-full"
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
            <motion.div className="flex-1">
              <motion.div
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                animate={
                  !isValid
                    ? {
                        x: [-5, 5, -5, 5, 0],
                        transition: { duration: 0.3 },
                      }
                    : {
                        scale: [1, 1.05, 1],
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }
                }
              >
                <motion.div
                  className={`w-full ${isValid ? styles.buttonGlow : ""}`}
                  animate={
                    isValid
                      ? {
                          boxShadow: dialogContent?.cheer
                            ? [
                                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                                "0 0 0 10px rgba(34, 197, 94, 0)",
                                "0 0 0 0 rgba(34, 197, 94, 0)",
                              ]
                            : [
                                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                                "0 0 0 10px rgba(239, 68, 68, 0)",
                                "0 0 0 0 rgba(239, 68, 68, 0)",
                              ],
                          transition: { duration: 2, repeat: Infinity },
                        }
                      : {}
                  }
                >
                  <Button
                    onClick={handleConfirm}
                    variant={dialogContent?.cheer ? "primary" : "destructive"}
                    disabled={!isValid}
                    className="w-full"
                  >
                    {actionText}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
