import { cn } from "app/lib/utils";

export const OngoingOutpostSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Skeleton */}
      <div className="bg-card border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 items-center py-4 space-y-4 lg:space-y-0">
            {/* Left side - Title and Description Skeleton */}
            <div className="lg:col-span-1 min-w-0">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded-md w-1/2 animate-pulse"></div>
              </div>
            </div>

            {/* Center - Timer and Mute Button Skeleton */}
            <div className="flex justify-center lg:col-span-1">
              <div className="flex items-stretch bg-muted/50 backdrop-blur-sm border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="flex-1 p-3">
                  <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                </div>
                <div className="border-l border-border flex-1 p-3">
                  <div className="h-8 bg-muted rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Right side - Actions Skeleton */}
            <div className="flex justify-center lg:justify-end lg:col-span-1 min-w-0">
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
                <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
                <div className="w-10 h-10 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Skeleton */}
      <div className="space-y-4">
        <div className="w-full h-[600px] relative rounded-xl overflow-hidden bg-muted animate-pulse">
          {/* Video area skeleton */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-card rounded-full mx-auto"></div>
              <div className="h-4 bg-card rounded-md w-32 mx-auto"></div>
            </div>
          </div>

          {/* Members list skeleton */}
          <div className="absolute top-4 right-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-2"
              >
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
