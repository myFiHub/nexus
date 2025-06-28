export function OutpostCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-border animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2"></div>
        </div>

        {/* Creator section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
