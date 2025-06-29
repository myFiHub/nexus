"use client";
import { PAGE_SIZE } from "app/lib/constants";
import { ReduxProvider } from "app/store/Provider";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutposts } from "../../components/outpost/LoadingOutposts";
import { OutpostsList } from "../../components/outpost/OutpostsList";
import { OutpostModel } from "../../services/api/types";
import { allOutpostsSelectors } from "./selectors";
import { allOutpostsActions, useAllOutpostsSlice } from "./slice";

interface ClientOutpostsListProps {
  initialOutposts: OutpostModel[];
}

const Content = ({ initialOutposts }: ClientOutpostsListProps) => {
  useAllOutpostsSlice();
  const dispatch = useDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get state from Redux
  const clientOutposts = useSelector(allOutpostsSelectors.outposts);
  const isLoadingMore = useSelector(allOutpostsSelectors.isLoadingMoreOutposts);
  const hasMore = useSelector(allOutpostsSelectors.hasMoreOutposts);
  const error = useSelector(allOutpostsSelectors.errorLoadingOutposts);

  // Initialize state with SSR data
  useEffect(() => {
    if (initialOutposts.length > 0) {
      // If we have SSR data, set it as the initial state
      dispatch(allOutpostsActions.setOutposts(initialOutposts));

      // If we have exactly PAGE_SIZE SSR cards, there might be more data
      // Set hasMoreOutposts to true and start from page 1
      if (initialOutposts.length === PAGE_SIZE) {
        dispatch(allOutpostsActions.setHasMoreOutposts(true));
      } else {
        // If we have fewer than PAGE_SIZE, we've reached the last page
        dispatch(allOutpostsActions.setHasMoreOutposts(false));
      }
    } else {
      // If no SSR data, start from the beginning
      dispatch(allOutpostsActions.getOutposts());
    }
  }, [dispatch, initialOutposts]);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(allOutpostsActions.loadMoreOutposts());
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoadingMore, hasMore, dispatch]
  );

  // Combine SSR and client-side outposts
  const allOutposts = [...initialOutposts, ...clientOutposts];

  // Remove duplicates based on UUID
  const uniqueOutposts = allOutposts.filter(
    (outpost, index, self) =>
      index === self.findIndex((o) => o.uuid === outpost.uuid)
  );

  return (
    <div>
      <OutpostsList outposts={uniqueOutposts} />

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={lastElementRef} className="py-8 w-full relative">
          {isLoadingMore ? (
            <LoadingOutposts
              count={3}
              loadingText="Loading more outposts..."
              showLoadingIndicator={true}
              loadingIndicatorPosition="bottom"
            />
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
      {!hasMore && uniqueOutposts.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            You've reached the end of all outposts
          </div>
        </div>
      )}
    </div>
  );
};

export const ClientOutpostsList = ({
  initialOutposts,
}: ClientOutpostsListProps) => {
  return (
    <ReduxProvider>
      <Content initialOutposts={initialOutposts} />
    </ReduxProvider>
  );
};
