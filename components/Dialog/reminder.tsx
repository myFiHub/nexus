"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button, ButtonProps } from "../Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface ReminderDialogProps {
  title?: ReactNode;
  content?: ReactNode;
  scheduledFor: number; // milliseconds timestamp
  confirmOpts?: {
    text?: string;
    variant?: ButtonProps["variant"];
  };
  cancelOpts?: {
    text?: string;
    variant?: ButtonProps["variant"];
  };
}

export type ReminderDialogResult = {
  confirmed: boolean;
  reminderMinutes?: number; // minutes before the event
};

let resolvePromise: ((value: ReminderDialogResult) => void) | null = null;

export const reminderDialog = ({
  title = "Set Reminder",
  content = "When would you like to be reminded?",
  scheduledFor,
  confirmOpts,
  cancelOpts,
}: ReminderDialogProps): Promise<ReminderDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-reminder-dialog", {
      detail: {
        title,
        content,
        scheduledFor,
        confirmOpts,
        cancelOpts,
      },
    });
    window.dispatchEvent(event);
  });
};

export const ReminderDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<number | null>(null);
  const [dialogContent, setDialogContent] =
    useState<ReminderDialogProps | null>(null);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<ReminderDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
      setSelectedReminder(null);
    };

    window.addEventListener(
      "show-reminder-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-reminder-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({
      confirmed: true,
      reminderMinutes: selectedReminder || undefined,
    });
    resolvePromise = null;
    setSelectedReminder(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false });
    resolvePromise = null;
    setSelectedReminder(null);
  };

  const getReminderOptions = (scheduledFor: number) => {
    const now = Date.now();
    const timeUntilEvent = scheduledFor - now;
    const options = [];

    // Only show options that are in the future
    if (timeUntilEvent > 0) {
      // 1 hour before
      if (timeUntilEvent > 60 * 60 * 1000) {
        options.push({ label: "1 hour before", minutes: 60 });
      }

      // 30 minutes before
      if (timeUntilEvent > 30 * 60 * 1000) {
        options.push({ label: "30 minutes before", minutes: 30 });
      }

      // 15 minutes before
      if (timeUntilEvent > 15 * 60 * 1000) {
        options.push({ label: "15 minutes before", minutes: 15 });
      }

      // 10 minutes before
      if (timeUntilEvent > 10 * 60 * 1000) {
        options.push({ label: "10 minutes before", minutes: 10 });
      }

      // 5 minutes before
      if (timeUntilEvent > 5 * 60 * 1000) {
        options.push({ label: "5 minutes before", minutes: 5 });
      }

      // When it starts
      options.push({ label: "When it starts", minutes: 0 });
    }

    // No Reminder option - always available
    options.push({ label: "No Reminder", minutes: -1 });

    return options;
  };

  const confirmOpts = dialogContent?.confirmOpts;
  const cancelOpts = dialogContent?.cancelOpts;
  const reminderOptions = dialogContent?.scheduledFor
    ? getReminderOptions(dialogContent.scheduledFor)
    : [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed (by clicking outside, pressing escape, etc.), treat as cancel
          handleCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">{dialogContent?.content}</p>
          <div className="space-y-2">
            {reminderOptions.map((option) => (
              <Button
                key={option.minutes}
                variant={
                  selectedReminder === option.minutes ? "primary" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => setSelectedReminder(option.minutes)}
              >
                {option.label}
              </Button>
            ))}
            {reminderOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No reminder options available. The event may have already
                started.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCancel}
            variant={cancelOpts?.variant || "ghost"}
          >
            {cancelOpts?.text || "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={confirmOpts?.variant || "primary"}
            disabled={selectedReminder === null}
          >
            {confirmOpts?.text || "Set Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
