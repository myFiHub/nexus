import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin text-white" />
      <span className="text-sm text-foreground">Loading...</span>
    </div>
  );
};
