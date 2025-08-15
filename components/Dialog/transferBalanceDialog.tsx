"use client";

/**
 * Transfer Balance Dialog Component
 *
 * Usage example:
 *
 * import { transferBalanceDialog } from "app/components/Dialog";
 *
 * const handleTransfer = async () => {
 *   const amount = await transferBalanceDialog();
 *
 *   if (amount > 0) {
 *     // User confirmed with amount
 *     console.log(`Transfer amount: ${amount}`);
 *     // Proceed with transfer action
 *   } else {
 *     // User cancelled or clicked outside
 *     console.log("User cancelled transfer");
 *   }
 * };
 */

import { AssetsSelectors } from "app/containers/_assets/selectore";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BalanceDisplay from "../BalanceDisplay";
import { Button } from "../Button";
import { Input } from "../Input";
import { Slider } from "../Slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

export interface TransferBalanceDialogResult {
  amount: number;
  address: string;
}

let resolvePromise: ((value: TransferBalanceDialogResult) => void) | null =
  null;

export const transferBalanceDialog =
  (): Promise<TransferBalanceDialogResult> => {
    return new Promise((resolve) => {
      resolvePromise = resolve;

      const event = new CustomEvent("show-transfer-balance-dialog");
      window.dispatchEvent(event);
    });
  };

export const TransferBalanceDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [isValid, setIsValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const balance = useSelector(AssetsSelectors.balance);
  const balanceValue = parseFloat(balance?.value || "0");
  const isLoading = balance?.loading;

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
      setInputValue("");
      setSliderValue([0]);
      setIsValid(false);
    };

    window.addEventListener("show-transfer-balance-dialog", handleShowDialog);
    return () => {
      window.removeEventListener(
        "show-transfer-balance-dialog",
        handleShowDialog
      );
    };
  }, []);

  // Movement address validation function
  const validateMovementAddress = useCallback((address: string) => {
    // Movement addresses are 66 characters long and contain only hex characters
    const MovementAddressRegex = /^0x[0-9a-fA-F]{64}$/;
    return MovementAddressRegex.test(address.trim());
  }, []);

  const validateInput = useCallback(
    (value: string) => {
      const numValue = parseFloat(value);

      // Check if input is valid number and greater than 0
      const isValidAmount =
        value.trim() !== "" && !isNaN(numValue) && numValue > 0;

      // Check if user has sufficient balance
      const hasSufficientBalance = numValue <= balanceValue;

      return isValidAmount && hasSufficientBalance;
    },
    [balanceValue]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setSliderValue([0]);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && balanceValue > 0) {
        const percentage = (numValue / balanceValue) * 100;
        setSliderValue([Math.min(100, Math.max(0, percentage))]);
      }
    }

    setIsValid(validateInput(value) && isAddressValid);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressValue(value);
    const valid = validateMovementAddress(value);
    setIsAddressValid(valid);
    setIsValid(validateInput(inputValue) && valid);
  };

  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue([percentage]);

    const amount = (percentage / 100) * balanceValue;
    setInputValue(amount.toFixed(8).replace(/\.?0+$/, ""));

    setIsValid(validateInput(amount.toString()) && isAddressValid);
  };

  const handleQuickPercentage = (percentage: number) => {
    setSliderValue([percentage]);
    const amount = (percentage / 100) * balanceValue;
    setInputValue(amount.toFixed(8).replace(/\.?0+$/, ""));
    setIsValid(validateInput(amount.toString()) && isAddressValid);
  };

  const handleConfirm = () => {
    if (!isValid) return;

    const amount = parseFloat(inputValue);
    const address = addressValue.trim();
    setIsOpen(false);
    resolvePromise?.({ amount, address });
    resolvePromise = null;
    setInputValue("");
    setAddressValue("");
    setSliderValue([0]);
    setIsValid(false);
    setIsAddressValid(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ amount: 0, address: "" });
    resolvePromise = null;
    setInputValue("");
    setAddressValue("");
    setSliderValue([0]);
    setIsValid(false);
    setIsAddressValid(false);
  };

  const percentageIndicators = [25, 50, 75, 100];

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
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 flex items-center justify-center"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
              >
                <motion.span
                  className="text-white text-xl font-bold"
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: {
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 2,
                    },
                  }}
                >
                  💰
                </motion.span>
              </motion.div>
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-xl font-semibold"
              >
                Transfer MOVE to Address
              </motion.span>
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="py-4 space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Balance Display */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="text-sm text-blue-700 dark:text-blue-300 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Available Balance
            </motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <BalanceDisplay
                className="text-2xl font-bold text-blue-800 dark:text-blue-200"
                loadingClassName="h-8 w-32 bg-blue-200 dark:bg-blue-800 animate-pulse rounded"
              />
            </motion.div>
          </motion.div>

          {/* Recipient Address Input */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.label
              className="block text-sm font-medium mb-3 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              Recipient Address
            </motion.label>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="text"
                placeholder="Enter receiver Movement address"
                value={addressValue}
                onChange={handleAddressChange}
                className={`text-center text-lg font-mono border-2 transition-colors ${
                  addressValue.trim() === ""
                    ? "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    : isAddressValid
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                    : "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                }`}
              />
            </motion.div>
            {addressValue.trim() !== "" && !isAddressValid && (
              <motion.p
                className="text-red-500 text-sm mt-2 text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Please enter a valid Movement address
              </motion.p>
            )}
            {addressValue.trim() !== "" && isAddressValid && (
              <motion.p
                className="text-green-600 text-sm mt-2 text-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                ✓ Valid Movement address
              </motion.p>
            )}
          </motion.div>

          {/* Transfer Amount Input */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <motion.label
              className="block text-sm font-medium mb-3 text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              Transfer Amount (MOVE)
            </motion.label>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="number"
                step="0.00000001"
                min="0.00000001"
                placeholder="0.0"
                value={inputValue}
                onChange={handleInputChange}
                className="text-center text-lg font-semibold border-blue-300 focus:border-blue-500 focus:ring-blue-500/20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </motion.div>
          </motion.div>

          {/* Percentage Slider */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="space-y-4"
          >
            <motion.div
              className="flex items-center justify-between text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <span>Percentage of Balance</span>
              <span className="font-medium">{sliderValue[0].toFixed(0)}%</span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
            >
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </motion.div>

            {/* Quick Percentage Buttons */}
            <motion.div
              className="flex gap-2 justify-between"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.1 }}
            >
              {percentageIndicators.map((percentage) => (
                <motion.button
                  key={percentage}
                  onClick={() => handleQuickPercentage(percentage)}
                  className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: 1.2 + percentageIndicators.indexOf(percentage) * 0.1,
                  }}
                >
                  {percentage}%
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Validation Error */}
          <AnimatePresence>
            {!isValid &&
              (inputValue.trim() !== "" || addressValue.trim() !== "") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <motion.p
                    className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      if (addressValue.trim() !== "" && !isAddressValid) {
                        return "Please enter a valid Movement address";
                      }

                      const numValue = parseFloat(inputValue);
                      if (isNaN(numValue) || numValue <= 0) {
                        return "Please enter a valid amount greater than 0";
                      } else if (numValue > balanceValue) {
                        return `Insufficient balance. You have ${balanceValue.toFixed(
                          8
                        )} MOVE available`;
                      } else if (!isAddressValid) {
                        return "Please enter a valid Movement address";
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
            className="flex gap-3 w-full"
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
                  className={`w-full ${
                    isValid ? "shadow-lg shadow-blue-500/30" : ""
                  }`}
                  animate={
                    isValid
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            "0 0 0 10px rgba(59, 130, 246, 0)",
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                          ],
                          transition: { duration: 2, repeat: Infinity },
                        }
                      : {}
                  }
                >
                  <Button
                    onClick={handleConfirm}
                    variant="primary"
                    disabled={!isValid || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Loading..." : "Transfer"}
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
