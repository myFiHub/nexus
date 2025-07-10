import { OutpostCardSkeleton } from "./outpostCard/skeleton";

interface LoadingOutpostsProps {
  count?: number;
  showLoadingIndicator?: boolean;
  loadingText?: string;
  className?: string;
  loadingIndicatorPosition?: "bottom" | "center";
}

export function LoadingOutposts({
  count = 6,
  showLoadingIndicator = true,
  loadingText = "Loading outposts...",
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr",
  loadingIndicatorPosition = "center",
}: LoadingOutpostsProps) {
  return (
    <div className="relative">
      <div className={className}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: "0.5s",
              animationFillMode: "both",
            }}
          >
            <OutpostCardSkeleton />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {showLoadingIndicator && (
        <div
          className={`flex justify-center py-8 ${
            loadingIndicatorPosition === "bottom"
              ? "absolute bottom-2 left-1/2 transform -translate-x-1/2"
              : ""
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            <span>{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
