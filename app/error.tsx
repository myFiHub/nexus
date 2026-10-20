"use client";

import { AppLink } from "app/components/AppLink";
import {
  primaryActionClass,
  secondaryActionClass,
  StatusPage,
} from "app/components/aurora/StatusPage";
import { isDev } from "app/lib/utils";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isDev) console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={<TriangleAlert className="h-6 w-6" />}
      tone="danger"
      title="Something went wrong"
      message={
        <>
          This page hit an unexpected error. Try again, or head back home.
          {error.digest && (
            <span className="mt-2 block font-mono text-xs opacity-70">
              Reference: {error.digest}
            </span>
          )}
        </>
      }
    >
      <button type="button" onClick={reset} className={primaryActionClass}>
        Try again
      </button>
      <AppLink href="/" className={secondaryActionClass}>
        Go home
      </AppLink>
    </StatusPage>
  );
}
