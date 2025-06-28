import { OutpostCardSkeleton } from "app/components/outpost/OutpostCardSkeleton";
import { OutpostsList } from "app/components/outpost/OutpostsList";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyOutposts } from "./components/emptyState";
import { myOutpostsSelectors } from "./selectors";
import { myOutpostsActions } from "./slice";

export const InfiniteScrollOutpostsList = () => {
  const dispatch = useDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get state from Redux
  const outposts = useSelector(myOutpostsSelectors.outposts);
  const isLoadingOutposts = useSelector(myOutpostsSelectors.isLoadingOutposts);
  const isLoadingMore = useSelector(myOutpostsSelectors.isLoadingMoreOutposts);
  const hasMore = useSelector(myOutpostsSelectors.hasMoreOutposts);
  const error = useSelector(myOutpostsSelectors.errorLoadingOutposts);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(myOutpostsActions.loadMoreOutposts());
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoadingMore, hasMore, dispatch]
  );

  return (
    <div>
      <OutpostsList
        outposts={outposts}
        loading={isLoadingOutposts}
        error={error}
        noOutpostComponent={<EmptyOutposts />}
      />

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={lastElementRef} className="flex justify-center py-8">
          {isLoadingMore ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr w-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <OutpostCardSkeleton key={`loading-${index}`} />
              ))}
            </div>
          ) : (
            <div className="h-8" /> // Invisible element for intersection observer
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium mb-2">
            Error loading more outposts
          </div>
          <div className="text-muted-foreground">{error}</div>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && outposts.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            You've reached the end of your outposts
          </div>
        </div>
      )}
    </div>
  );
};
