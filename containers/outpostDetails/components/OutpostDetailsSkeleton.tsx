export function OutpostDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Image with Overlay Skeleton */}
        <div className="relative w-full mb-8 rounded-xl overflow-hidden">
          <div className="w-full h-64 md:h-80 bg-[var(--card-bg)] animate-pulse rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-2 w-3/4" />
            <div className="h-6 bg-white/20 rounded-lg animate-pulse w-1/2" />
          </div>
          {/* Share Button Skeleton */}
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Creator Card Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-[var(--card-bg)] rounded animate-pulse w-20" />
                  <div className="w-6 h-6 bg-[var(--card-bg)] rounded-full animate-pulse" />
                  <div className="h-6 bg-[var(--card-bg)] rounded animate-pulse w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[var(--card-bg)] rounded animate-pulse" />
                  <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-24" />
                  <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-20" />
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-full mb-2" />
                  <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-3/4" />
                </div>
              </div>
            </div>

            {/* Event Details Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="h-8 bg-[var(--card-bg)] rounded animate-pulse w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--card-bg)] rounded animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-20 mb-1" />
                    <div className="h-3 bg-[var(--card-bg)] rounded animate-pulse w-24" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--card-bg)] rounded animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-24 mb-1" />
                    <div className="h-3 bg-[var(--card-bg)] rounded animate-pulse w-20" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--card-bg)] rounded animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-20 mb-1" />
                    <div className="h-3 bg-[var(--card-bg)] rounded animate-pulse w-28" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--card-bg)] rounded animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-24 mb-1" />
                    <div className="h-3 bg-[var(--card-bg)] rounded animate-pulse w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="flex gap-2">
                <div className="h-6 bg-[var(--card-bg)] rounded-full animate-pulse w-16" />
                <div className="h-6 bg-[var(--card-bg)] rounded-full animate-pulse w-20" />
                <div className="h-6 bg-[var(--card-bg)] rounded-full animate-pulse w-14" />
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Join Button Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="h-12 bg-[var(--card-bg)] rounded-lg animate-pulse" />
            </div>

            {/* Invite Button Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="h-12 bg-[var(--card-bg)] rounded-lg animate-pulse" />
            </div>

            {/* Members List Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="h-6 bg-[var(--card-bg)] rounded animate-pulse w-24 mb-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--card-bg)] rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--card-bg)] rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--card-bg)] rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--card-bg)] rounded animate-pulse w-18" />
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section Skeleton */}
            <div className="bg-card p-6 rounded-xl shadow-sm">
              <div className="h-6 bg-[var(--card-bg)] rounded animate-pulse w-32 mb-4" />
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-[var(--card-bg)] rounded animate-pulse" />
                <div className="flex-1 h-10 bg-[var(--card-bg)] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
