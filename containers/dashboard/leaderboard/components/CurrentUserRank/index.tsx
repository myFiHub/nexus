"use client";
import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { GlobalSelectors } from "app/containers/global/selectors";
import { cn } from "app/lib/utils";
import { ReduxProvider } from "app/store/Provider";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaderboardSelectors } from "../../selectors";
import { leaderboardActions } from "../../slice";
import { AnimatedNumberOne } from "../animatedRank/first";
import { AnimatedNumberTwo } from "../animatedRank/second";
import { AnimatedNumberThree } from "../animatedRank/third";
import { CurrentUserRankSkeleton } from "./skeleton";

const renderRankDisplay = (rank: number) => {
  if (rank === 0) {
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
    );
  }
  if (rank === 1) {
    return <AnimatedNumberOne />;
  } else if (rank === 2) {
    return <AnimatedNumberTwo />;
  } else if (rank === 3) {
    return <AnimatedNumberThree />;
  } else {
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
        <span className="text-lg font-bold text-white">#{rank}</span>
      </div>
    );
  }
};

const getRankText = (rank: number) => {
  if (rank === 0) return "You are not in the list";
  if (rank === 1) return "You are the champion! 🏆";
  if (rank === 2) return "You are the runner-up! 🥈";
  if (rank === 3) return "You are the bronze medalist! 🥉";
  if (rank === 4) return "You are 4th place!";
  if (rank === 5) return "You are 5th place!";
  if (rank <= 10) return `You are ${rank}th place!`;
  if (rank <= 20) return `You are ${rank}th!`;
  if (rank <= 50) return `You are ${rank}th!`;
  if (rank <= 100) return `You are ${rank}th!`;
  return `You are ${rank}th!`;
};

const Content = ({ filter }: { filter: LeaderboardTags }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const rankObject = useSelector(leaderboardSelectors.currentUserRank(filter));
  const [rotating, setRotating] = useState(false);
  const rank = rankObject.rank;
  const isLoading = rankObject.gettingRank;

  const handleRefresh = () => {
    setRotating(true);
    setTimeout(() => {
      setRotating(false);
    }, 1000);
    dispatch(leaderboardActions.getCurrentUserRank({ filter }));
  };

  return (
    <AnimatePresence>
      {myUser && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden mb-4"
        >
          {isLoading ? (
            <CurrentUserRankSkeleton />
          ) : (
            <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 m-0">
                    {renderRankDisplay(rank)}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-3xl flex items-center gap-2 font-bold text-white leading-none">
                      <div className="text-sm text-white/60 mt-1">
                        {getRankText(rank)}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={cn(
                    "p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 cursor-pointer",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center",
                    isLoading && "animate-spin",
                    rotating && "animate-spin"
                  )}
                >
                  <RefreshCw className="w-3 h-3 text-white/70" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CurrentUserRank = ({ filter }: { filter: LeaderboardTags }) => {
  return (
    <ReduxProvider>
      <Content filter={filter} />
    </ReduxProvider>
  );
};
