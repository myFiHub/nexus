"use client";

import { Img } from "app/components/Img";
import { NFTResponse } from "app/services/move/types";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { myProfileSelectors } from "../../selectors";
import { profileActions } from "../../slice";

interface NFTCardProps {
  nft: NFTResponse;
  index: number;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      delay: 0.1,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

const glowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.3 },
  hover: { opacity: 0.6 },
};

export const NFTCard = ({ nft, index }: NFTCardProps) => {
  const dispatch = useDispatch();
  const settingNftAsProfilePicture = useSelector(
    myProfileSelectors.settingNftAsProfilePicture
  );

  const handleSetClick = () => {
    dispatch(profileActions.useNftAsProfilePicture(nft));
  };

  const isLoading = settingNftAsProfilePicture === nft.image_url;
  const isSettingThisImage = settingNftAsProfilePicture === nft.image_url;
  const shouldMaskBlackAndWhite =
    !isSettingThisImage && settingNftAsProfilePicture;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Glow effect */}
      <motion.div
        variants={glowVariants}
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"
      />

      {/* Card content */}
      <motion.div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Image container */}
        <motion.div
          variants={imageVariants}
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20"
        >
          <Img
            src={nft.image_url}
            alt={nft.current_token_data.token_name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              shouldMaskBlackAndWhite ? "grayscale blur-sm" : ""
            }`}
            onError={(e) => {
              console.error("Failed to load NFT image:", e);
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Loading overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm font-medium">
                  Setting as profile picture...
                </p>
              </div>
            </motion.div>
          )}

          {/* Amount badge */}
          {nft.amount > 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              x{nft.amount}
            </motion.div>
          )}
        </motion.div>

        {/* Set as Profile Picture Button - positioned over the image */}
        {!isLoading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <motion.button
              initial={{ y: 20, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSetClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg backdrop-blur-sm border border-purple-400/30 transition-all duration-200 z-20 cursor-pointer"
            >
              Set as Profile Picture
            </motion.button>
          </div>
        )}

        {/* Card info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="p-4 space-y-2"
        >
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="font-semibold text-foreground line-clamp-1 group-hover:text-purple-400 transition-colors duration-300"
          >
            {nft.current_token_data.token_name}
          </motion.h4>

          {nft.current_token_data.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-sm text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300"
            >
              {nft.current_token_data.description}
            </motion.p>
          )}

          {/* Animated border on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500/30 transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
