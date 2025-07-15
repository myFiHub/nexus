"use client";

import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import { User } from "app/services/api/types";
import { motion } from "framer-motion";
import { Crown, Shield, Star, User as UserIcon } from "lucide-react";

interface UserInfoDisplayProps {
  user: User;
  actionType: "buy" | "sell";
  className?: string;
}

export const UserInfoDisplay = ({
  user,
  actionType,
  className = "",
}: UserInfoDisplayProps) => {
  const userImage = user.image || logoUrl;
  // Note: User type doesn't have has_ticket or verified properties
  // These would need to be added to the User type if they exist in the API
  const isPremium = false; // user.has_ticket - removed as it doesn't exist in User type
  const hasVerifiedBadge = false; // user.verified - removed as it doesn't exist in User type

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-gradient-to-br from-background via-muted to-accent/20 rounded-xl border border-border p-4 relative ${className}`}
    >
      {/* Header with action type */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              actionType === "buy"
                ? "bg-success/20 text-success border border-success/30"
                : "bg-warning/20 text-warning border border-warning/30"
            }`}
          >
            {actionType === "buy" ? "Buying" : "Selling"}
          </div>
          <span className="text-xs text-muted-foreground">pass from</span>
        </div>

        {/* Premium badge - only show if isPremium is true */}
        {isPremium && (
          <motion.div
            variants={badgeVariants}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-warning to-warning/80 rounded-full text-xs font-semibold text-warning-foreground"
          >
            <Crown className="w-3 h-3" />
            <span>Premium</span>
          </motion.div>
        )}
      </motion.div>

      {/* User profile section */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        {/* Avatar with animation */}
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-card shadow-lg">
            <Img
              src={userImage}
              alt={user.name || "User"}
              useImgTag
              className="w-full h-full object-cover"
            />
          </div>

          {/* Verified badge - only show if hasVerifiedBadge is true */}
          {hasVerifiedBadge && (
            <motion.div
              variants={badgeVariants}
              className="absolute -top-1 -right-1 bg-info rounded-full p-1"
            >
              <Shield className="w-3 h-3 text-info-foreground" />
            </motion.div>
          )}
        </motion.div>

        {/* User details */}
        <div className="flex-1 min-w-0">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-1"
          >
            <h4 className="font-semibold text-foreground truncate">
              {user.name || "Anonymous"}
            </h4>
            {isPremium && (
              <motion.div
                variants={badgeVariants}
                className="flex items-center gap-1"
              >
                <Star className="w-3 h-3 text-warning fill-warning" />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <UserIcon className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-mono truncate">
              {truncate(user.aptos_address || user.address, 20)}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Action description */}
      <motion.div
        variants={itemVariants}
        className="mt-3 pt-3 border-t border-border"
      >
        <p className="text-sm text-foreground">
          {actionType === "buy" ? (
            <>
              <span className="font-medium text-success">Buy</span> a pass from{" "}
              <span className="font-semibold text-primary">
                {user.name || "this user"}
              </span>
            </>
          ) : (
            <>
              <span className="font-medium text-warning">Sell</span> your
              <span className="font-semibold text-primary">
                {" "}
                {user.name || "this user"}{" "}
              </span>
              pass
            </>
          )}
        </p>
      </motion.div>

      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-5 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, hsl(var(--muted) / 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
    </motion.div>
  );
};
