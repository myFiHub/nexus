"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "app/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

// Export user select dialog components
export { userSelectDialog, UserSelectDialogProvider } from "./userSelectDialog";
export type { UserSelectDialogResult } from "./userSelectDialog";

// Export luma user dialog components
export { lumaUserDialog, LumaUserDialogProvider } from "./luma_userDialog";
export type { LumaUserDialogResult } from "./luma_userDialog";

// Export search dialog components
export { searchDialog, SearchDialogProvider } from "./searchDialog";
export type { SearchDialogResult } from "./searchDialog";

// Export confirm add or switch account dialog components
export {
  confirmAddOrSwitchAccountDialog,
  ConfirmAddOrSwitchAccountDialogProvider,
} from "./confirmAddOrSwitchAccountDialog";
export type { ConfirmAddOrSwitchAccountDialogResult } from "./confirmAddOrSwitchAccountDialog";

// Export account card action select dialog components
export {
  accountCardActionSelectDialog,
  AccountCardActionSelectDialogProvider,
} from "../../containers/profile/components/SecuritySection/dialogs/accountCardActionSelectDialog";
export type { AccountCardActionSelectDialogResult } from "../../containers/profile/components/SecuritySection/dialogs/accountCardActionSelectDialog";

// Export buy or sell pass dialog components
export {
  buyOrSellPassDialog,
  BuyOrSellPassDialogProvider,
} from "../../containers/_assets/buyOrSellPassDialog";
export type { BuyOrSellPassDialogResult } from "../../containers/_assets/buyOrSellPassDialog";

// Export cheer boo amount dialog components
export {
  cheerBooAmountDialog,
  CheerBooAmountDialogProvider,
} from "./cheerBooAmountDialog";
export type { CheerBooAmountDialogResult } from "./cheerBooAmountDialog";

// Export logout dialog components
export { logoutDialog, LogoutDialogProvider } from "./logoutDialog";

// Export leave outpost warning dialog components
export {
  leaveOutpostWarningDialog,
  LeaveOutpostWarningDialogProvider,
} from "../../containers/ongoingOutpost/dialogs/leaveOutpostWarning";
export type { LeaveOutpostWarningDialogResult } from "../../containers/ongoingOutpost/dialogs/leaveOutpostWarning";

// Export prompt notifications dialog components
export {
  promptNotifications,
  PromptNotificationsDialogProvider,
  resetNotificationsDeclined,
} from "./promptNotifications";

// Export referrer dialog components
export { referrerDialog, ReferrerDialogProvider } from "./referrerDialog";
export type { ReferrerDialogResult } from "./referrerDialog";

// Export name dialog components
export { nameDialog, NameDialogProvider } from "./nameDialog";
export type { NameDialogResult } from "./nameDialog";
export type { PromptNotificationsResult } from "./promptNotifications";

// Export login prompt dialog components
export {
  loginPromptDialog,
  LoginPromptDialogProvider,
} from "./loginPromptDialog";
export type { LoginPromptDialogResult } from "./loginPromptDialog";
