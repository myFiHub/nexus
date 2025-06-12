"use client";

import * as React from "react";
import { Button } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface ConfirmDialogProps {
  title: React.ReactNode;
  content: React.ReactNode;
}

let resolvePromise: ((value: boolean) => void) | null = null;

export const confirmDialog = ({
  title,
  content,
}: ConfirmDialogProps): Promise<boolean> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;
    const event = new CustomEvent("show-confirm-dialog", {
      detail: { title, content },
    });
    window.dispatchEvent(event);
  });
};

export const ConfirmDialogProvider = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogContent, setDialogContent] =
    React.useState<ConfirmDialogProps | null>(null);

  React.useEffect(() => {
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
    resolvePromise?.(true);
    resolvePromise = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
    resolvePromise = null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{dialogContent?.content}</div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
