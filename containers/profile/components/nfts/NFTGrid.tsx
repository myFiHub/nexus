"use client";

import { motion } from "framer-motion";
import { NFTResponse } from "app/services/move/types";
import { NFTCard } from "./NFTCard";

interface NFTGridProps {
  nfts: NFTResponse[];
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const NFTGrid = ({ nfts }: NFTGridProps) => {
  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {nfts.map((nft, index) => (
        <NFTCard key={`${nft.current_token_data.token_name}-${index}`} nft={nft} index={index} />
      ))}
    </motion.div>
  );
};
