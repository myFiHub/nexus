"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myProfileSelectors } from "../../selectors";
import { profileActions } from "../../slice";
import { NFTEmptyState } from "./NFTEmptyState";
import { NFTGrid } from "./NFTGrid";
import { NFTLoadingState } from "./NFTLoadingState";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const NFTSSection = () => {
  // Configuration
  const NFT_DISPLAY_LIMIT =
    typeof window !== "undefined" ? (window.innerWidth > 768 ? 6 : 3) : 3;

  const dispatch = useDispatch();
  const { data: nfts, loading, error } = useSelector(myProfileSelectors.nfts);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAllNfts, setShowAllNfts] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(profileActions.fetchNfts({ silent: true }));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
  };

  const handleToggleShowMore = () => {
    setShowAllNfts(!showAllNfts);
  };

  const hasMoreNfts = nfts.length > NFT_DISPLAY_LIMIT;
  const displayedNfts = showAllNfts ? nfts : nfts.slice(0, NFT_DISPLAY_LIMIT);
  const remainingCount = nfts.length - NFT_DISPLAY_LIMIT;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            My NFTs
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-muted-foreground"
          >
            Your digital collectibles and unique assets
          </motion.p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`relative p-3 cursor-pointer rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <RefreshCw className="w-5 h-5 text-purple-600 group-hover:text-purple-500 transition-colors" />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
          />
        </button>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading && nfts.length === 0 ? (
          <NFTLoadingState key="loading" />
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8"
          >
            <div className="text-red-500 mb-2">Failed to load NFTs</div>
            <button
              onClick={handleRefresh}
              className="text-sm text-purple-600 hover:text-purple-500 underline"
            >
              Try again
            </button>
          </motion.div>
        ) : nfts.length === 0 ? (
          <NFTEmptyState key="empty" />
        ) : (
          <div key="grid" className="space-y-6">
            {/* Initial NFTs Grid */}
            <NFTGrid nfts={displayedNfts} />

            {/* See More Button */}
            {hasMoreNfts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleToggleShowMore}
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <div className="flex items-center space-x-2">
                    {showAllNfts ? (
                      <>
                        <span className="text-purple-600 group-hover:text-purple-500 transition-colors font-medium">
                          Show Less
                        </span>
                        <ChevronUp className="w-4 h-4 text-purple-600 group-hover:text-purple-500 transition-colors" />
                      </>
                    ) : (
                      <>
                        <span className="text-purple-600 group-hover:text-purple-500 transition-colors font-medium">
                          See {remainingCount} More
                        </span>
                        <ChevronDown className="w-4 h-4 text-purple-600 group-hover:text-purple-500 transition-colors" />
                      </>
                    )}
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                  />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
