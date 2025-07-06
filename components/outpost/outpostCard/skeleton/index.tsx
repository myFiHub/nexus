export function OutpostCardSkeleton() {
  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden h-full flex flex-col relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Image skeleton */}
      <div className="relative w-full h-52 bg-gray-200 dark:bg-gray-700">
        {/* Action buttons skeleton */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <div className="bg-background/90 rounded-md border border-border/50 p-1">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="bg-background/90 rounded-md border border-border/50 p-1">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        {/* Members info skeleton */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <div className="bg-background/90 rounded-md border border-border/50 p-2">
            <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="bg-background/90 rounded-md border border-border/50 p-2">
            <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      {/* Floating indicators skeleton */}
      <div className="absolute -bottom-4 left-4 right-4 z-20">
        <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm p-3">
          <div className="flex gap-3">
            <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 pt-8 flex-1 flex flex-col space-y-4">
        {/* Title and description */}
        <div className="space-y-3">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3"></div>
        </div>

        {/* Compact creator section */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-16"></div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-border/30">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
