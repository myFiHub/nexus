"use client";
import { toast as sonnerToast } from "sonner";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  duration?: number;
  action?: ToastAction;
  permanent?: boolean;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    const toastId = sonnerToast.success(message, {
      duration: options?.permanent ? Infinity : options?.duration || 4000,
      dismissible: !options?.permanent,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
    return toastId;
  },

  error: (message: string, options?: ToastOptions) => {
    const toastId = sonnerToast.error(message, {
      duration: options?.permanent ? Infinity : options?.duration || 4000,
      dismissible: !options?.permanent,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
    return toastId;
  },

  warning: (message: string, options?: ToastOptions) => {
    const toastId = sonnerToast.warning(message, {
      duration: options?.permanent ? Infinity : options?.duration || 4000,
      dismissible: !options?.permanent,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
    return toastId;
  },

  info: (message: string, options?: ToastOptions) => {
    const toastId = sonnerToast.info(message, {
      duration: options?.permanent ? Infinity : options?.duration || 4000,
      dismissible: !options?.permanent,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
    return toastId;
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      action,
      permanent,
    }: {
      loading: string;
      success: string;
      error: string;
      action?: ToastAction;
      permanent?: boolean;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
      duration: permanent ? Infinity : undefined,
      dismissible: !permanent,
    });
  },

  dismiss: (toastId: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};
