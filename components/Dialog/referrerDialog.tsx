"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

export type ReferrerDialogResult = {
  confirmed: boolean;
  enteredText: string;
};

let resolvePromise: ((value: ReferrerDialogResult) => void) | null = null;

export const referrerDialog = (): Promise<ReferrerDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-referrer-dialog");
    window.dispatchEvent(event);
  });
};

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ReferrerDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const handleShowDialog = () => {
      setIsOpen(true);
    };

    window.addEventListener("show-referrer-dialog", handleShowDialog);
    return () => {
      window.removeEventListener("show-referrer-dialog", handleShowDialog);
    };
  }, []);

  useEffect(() => {
    setIsValid(UUID_REGEX.test(inputValue.trim()));
  }, [inputValue]);

  const handleConfirm = () => {
    if (!isValid) return;
    setIsOpen(false);
    resolvePromise?.({ confirmed: true, enteredText: inputValue.trim() });
    resolvePromise = null;
    setInputValue("");
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false, enteredText: "" });
    resolvePromise = null;
    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCancel();
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <DialogHeader>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <DialogTitle className="text-xl font-semibold text-center">
                    Do you have a referrer?
                  </DialogTitle>
                </motion.div>
              </DialogHeader>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="py-6"
              >
                <div className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Please enter your referrer&apos;s UUID to continue
                  </div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Input
                      type="text"
                      placeholder="e.g., 01976487-1310-7f53-9500-9879d67d7fa9"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`transition-all duration-200 ${
                        inputValue && !isValid
                          ? "border-red-500 focus:border-red-500"
                          : inputValue && isValid
                          ? "border-green-500 focus:border-green-500"
                          : ""
                      }`}
                    />
                  </motion.div>

                  {/* Validation message container with fixed height to prevent UI jumps */}
                  <div className="h-6 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {inputValue && !isValid && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="text-red-500 text-xs text-center"
                        >
                          Please enter a valid UUID format
                        </motion.div>
                      )}
                      {inputValue && isValid && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: -10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="text-green-500 text-xs text-center"
                        >
                          ✓ Valid UUID format
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <DialogFooter>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="flex gap-3 w-full"
                >
                  <Button
                    onClick={handleCancel}
                    variant="ghost"
                    className="flex-1 h-10"
                  >
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <motion.div
                      animate={
                        isValid
                          ? {
                              scale: [1, 1.02, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(34, 197, 94, 0)",
                                "0 0 0 4px rgba(34, 197, 94, 0.2)",
                                "0 0 0 0 rgba(34, 197, 94, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={
                        isValid
                          ? {
                              scale: {
                                duration: 0.4,
                                repeat: 1,
                                ease: "easeInOut",
                              },
                              boxShadow: {
                                duration: 0.4,
                                repeat: 1,
                                ease: "easeInOut",
                              },
                            }
                          : {}
                      }
                    >
                      <Button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className={`w-full h-10 transition-all duration-300 ${
                          isValid
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
