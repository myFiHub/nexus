"use client";

import { Img } from "app/components/Img";
import { truncate } from "app/lib/utils";
import { User } from "app/services/api/types";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface CohostItemProps {
  user: User;
  onRemove: (uuid: string) => void;
}

export const CohostItem = ({ user, onRemove }: CohostItemProps) => {
  return (
    <motion.div
      key={user.uuid}
      layout
      initial={{
        opacity: 0,
        scale: 0.8,
        x: -20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: 20,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className="flex items-center gap-3 p-3 rounded-lg border border-primary/50 bg-primary/5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
      >
        <Img
          src={user.image}
          alt={user.name || "placeholder"}
          className="w-10 h-10 rounded-full border-2 border-primary"
          useImgTag
        />
      </motion.div>
      <motion.div
        className="flex-1 min-w-0"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h4 className="font-semibold text-foreground text-sm">
          {user.name || "Anonymous User"}
        </h4>
        {user.uuid && (
          <p className="text-[11px] text-muted-foreground font-mono">
            {truncate(user.uuid)}
          </p>
        )}
      </motion.div>
      <motion.button
        onClick={() => onRemove(user.uuid)}
        className="p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0.2 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
