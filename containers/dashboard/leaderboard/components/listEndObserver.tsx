"use client";

import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaderboardSelectors } from "../selectors";
import { leaderboardActions } from "../slice";

const Content = ({ type }: { type: LeaderboardTags }) => {
  const dispatch = useDispatch();
  const hasMoreData = useSelector(leaderboardSelectors.hasMoreData(type));
  const gettingUsers = useSelector(leaderboardSelectors.gettingUsers(type));
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (hasMoreData && !gettingUsers) {
            dispatch(leaderboardActions.getClientSideLeaderboard(type));
          }
        }
      });
    });
    if (ref.current) {
      observerRef.current.observe(ref.current);
    }
  }, [hasMoreData, gettingUsers, dispatch]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-8 px-4"
    >
      {gettingUsers && (
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading more...</span>
        </div>
      )}

      {!hasMoreData && !gettingUsers && (
        <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-sm">You've reached the end</span>
          <span className="text-xs">No more to load</span>
        </div>
      )}

      {hasMoreData && !gettingUsers && (
        <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs">Scroll to load more</span>
        </div>
      )}
    </div>
  );
};

const ListEndObserver = ({ type }: { type: LeaderboardTags }) => {
  return (
    <ReduxProvider>
      <Content type={type} />
    </ReduxProvider>
  );
};

export default ListEndObserver;
