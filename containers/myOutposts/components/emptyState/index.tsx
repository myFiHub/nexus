import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "../../../../lib/utils";
import { CreateOutpostButton } from "../createOutpostButton";
import { DiscoverButton } from "../discoverButton";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Icon */}
      {icon && (
        <motion.div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50"
          variants={iconVariants}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="h-10 w-10 text-muted-foreground"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        className="mb-2 text-xl font-semibold text-foreground sm:text-2xl"
        variants={itemVariants}
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          className="mb-6 max-w-sm text-sm text-muted-foreground sm:text-base"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      )}

      {/* Action Button */}
      {actions && (
        <motion.div variants={buttonVariants} className="flex gap-2">
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
};

// Default empty state for outposts
export const EmptyOutposts = () => {
  return (
    <EmptyState
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      }
      title="No outposts yet"
      description="Create your first outpost to start connecting with others and building your community."
      actions={
        <>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <DiscoverButton />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <CreateOutpostButton />
          </motion.div>
        </>
      }
    />
  );
};
