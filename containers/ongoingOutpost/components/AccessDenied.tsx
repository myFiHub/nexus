import { Button } from "app/components/Button";
import { JoinButton } from "app/containers/outpostDetails/components/JoinButton";
import { AppPages } from "app/lib/routes";
import { OutpostModel } from "app/services/api/types";
import { easeInOut, easeOut, motion } from "framer-motion";
import { AlertCircle, Lock, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  outpost: OutpostModel;
}

export const AccessDenied = ({ outpost }: AccessDeniedProps) => {
  const router = useRouter();

  const goBack = () => {
    router.push(AppPages.outpostDetails(outpost.uuid));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easeInOut,
        delay: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
        delay: 0.5,
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
        delay: 0.7,
      },
    },
  };

  const reasonsContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
        delay: 0.9,
        staggerChildren: 0.1,
      },
    },
  };

  const reasonItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.6,
        staggerChildren: 0.2,
      },
    },
  };

  const firstButtonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: 1.6,
      },
    },
  };

  const secondButtonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: 1.8,
      },
    },
  };

  const thirdButtonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        delay: 2.0,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card border border-border rounded-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto"
          variants={iconVariants}
        >
          <Shield className="w-10 h-10 text-destructive" />
        </motion.div>

        {/* Content */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <motion.h3
            className="text-2xl font-bold text-foreground"
            variants={titleVariants}
          >
            Access Restricted
          </motion.h3>
          <motion.p
            className="text-muted-foreground leading-relaxed"
            variants={descriptionVariants}
          >
            You don't have permission to enter this outpost. This may be
            because:
          </motion.p>

          <motion.div
            className="text-left space-y-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg"
            variants={reasonsContainerVariants}
          >
            <motion.div
              className="flex items-start gap-2"
              variants={reasonItemVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
              <span>The outpost requires special access permissions</span>
            </motion.div>
            <motion.div
              className="flex items-start gap-2"
              variants={reasonItemVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="w-4 h-4 mt-0.5 text-blue-500" />
              <span>You may need to be invited by the creator</span>
            </motion.div>
            <motion.div
              className="flex items-start gap-2"
              variants={reasonItemVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-4 h-4 mt-0.5 text-green-500" />
              <span>Certain membership requirements need to be met</span>
            </motion.div>
            <motion.div
              className="flex items-start gap-2"
              variants={reasonItemVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4 mt-0.5 text-red-500" />
              <span>There was an error joining the outpost</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="w-full space-y-3"
          variants={buttonContainerVariants}
        >
          <motion.div variants={firstButtonVariants}>
            <Button onClick={goBack} className="w-full gap-2" variant="outline">
              View Outpost Details
            </Button>
          </motion.div>

          <motion.div variants={secondButtonVariants}>
            <Button
              onClick={() => router.push(AppPages.allOutposts)}
              className="w-full"
              variant="outline"
            >
              Browse Other Outposts
            </Button>
          </motion.div>

          <motion.div variants={thirdButtonVariants}>
            <JoinButton
              outpost={outpost}
              joinComponent={<div>Request to Join this outpost</div>}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
