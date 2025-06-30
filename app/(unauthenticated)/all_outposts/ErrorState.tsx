import { AppLink } from "app/components/AppLink";
import { Button } from "app/components/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  error?: Error;
}

export const ErrorState = ({
  error = new Error("Something went wrong"),
  title = "Something went wrong while loading the page content",
  description = "Please try again",
  icon = <AlertCircle className="h-10 w-10 text-destructive" />,
  buttonText = "Try Again",
  buttonHref = "/",
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[400px]">
      {/* Error Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        {icon}
      </div>

      {/* Error Title */}
      <h3 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h3>

      {/* Error Description */}
      <p className="mb-6 max-w-sm text-sm text-muted-foreground sm:text-base">
        {error.message || description}
      </p>

      {/* Retry Button */}
      <AppLink href="/" className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        {buttonText}
      </AppLink>
    </div>
  );
};
