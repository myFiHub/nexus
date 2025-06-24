"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { OutpostModel } from "app/services/api/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../../../components/Dialog/index";
import { cn } from "../../../lib/utils";
import { OutpostAccesses } from "../../global/effects/types";
import { ConfirmButton } from "./confirmButton";
import { UsersList } from "./usersList";

interface OutpostAccessesDialogProps {
  outpost?: OutpostModel;
}

export type OutpostAccessesDialogResult = {
  confirmed: boolean;
  accesses?: OutpostAccesses;
};

let resolvePromise: ((value: OutpostAccessesDialogResult) => void) | null =
  null;

export const openOutpostPassCheckDialog = ({
  outpost,
}: OutpostAccessesDialogProps): Promise<OutpostAccessesDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-outpost-accesses-dialog", {
      detail: {
        outpost,
      },
    });
    window.dispatchEvent(event);
  });
};

export const OutpostAccessesDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [incomingData, setIncomingData] = useState<
    OutpostAccessesDialogProps | undefined
  >(undefined);
  const [accesses, setAccesses] = useState<OutpostAccesses | undefined>(
    undefined
  );

  useEffect(() => {
    const handleShowDialog = (
      event: CustomEvent<OutpostAccessesDialogProps>
    ) => {
      setIncomingData(event.detail);
      setIsOpen(true);
      setAccesses(undefined);
    };

    window.addEventListener(
      "show-outpost-accesses-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-outpost-accesses-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({
      confirmed: true,
      accesses,
    });
    resolvePromise = null;
    setAccesses(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && resolvePromise) {
      // Dialog was closed without confirmation
      resolvePromise({
        confirmed: false,
        accesses: undefined,
      });
      resolvePromise = null;
      setAccesses(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "bg-background fixed inset-0 z-50 grid w-full h-full",
            "sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:h-auto sm:max-w-lg sm:rounded-lg sm:border sm:p-6 sm:shadow-lg sm:gap-4 sm:duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <DialogHeader>
            <DialogTitle>Passes</DialogTitle>
          </DialogHeader>
          <UsersList outpost={incomingData?.outpost} />
          <DialogFooter>
            <ConfirmButton onClick={handleConfirm} />
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
