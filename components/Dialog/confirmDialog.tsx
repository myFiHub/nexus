"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button, ButtonProps } from "../Button";
import { Input } from "../Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface ConfirmDialogProps {
  title: ReactNode;
  content: ReactNode;
  cancleColorScheme?: ButtonProps["colorScheme"];
  inputOpts?: {
    inputType?: "text" | "password" | "email" | "number" | "tel" | "url";
    inputPlaceholder?: string;
  };
  confirmOpts?: {
    confirmColorScheme?: ButtonProps["colorScheme"];
    confirmText?: string;
  };
  cancelOpts?: {
    cancelColorScheme?: ButtonProps["colorScheme"];
    cancelText?: string;
  };
}

export type ConfirmDialogResult = {
  confirmed: boolean;
  enteredText?: string;
};

let resolvePromise: ((value: ConfirmDialogResult) => void) | null = null;

export const confirmDialog = ({
  title,
  content,
  confirmOpts,
  cancelOpts,
  inputOpts,
}: ConfirmDialogProps): Promise<ConfirmDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-confirm-dialog", {
      detail: {
        title,
        content,
        confirmOpts,
        cancelOpts,
        inputOpts,
      },
    });
    window.dispatchEvent(event);
  });
};

export const ConfirmDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dialogContent, setDialogContent] = useState<ConfirmDialogProps | null>(
    null
  );

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<ConfirmDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-confirm-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-confirm-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true, enteredText: inputValue });
    resolvePromise = null;
    setInputValue("");
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false, enteredText: inputValue });
    resolvePromise = null;
    setInputValue("");
  };

  const confirmOpts = dialogContent?.confirmOpts;
  const cancelOpts = dialogContent?.cancelOpts;
  const inputOpts = dialogContent?.inputOpts;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{dialogContent?.content}</div>
        {inputOpts && (
          <div className="mb-4">
            <Input
              type={inputOpts.inputType || "text"}
              placeholder={inputOpts.inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            colorScheme={cancelOpts?.cancelColorScheme || "primary"}
            onClick={handleCancel}
          >
            {cancelOpts?.cancelText || "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            colorScheme={confirmOpts?.confirmColorScheme || "primary"}
          >
            {confirmOpts?.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
