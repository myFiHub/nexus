"use client";

import UserLink from "app/components/AppLink/userLink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import { Img } from "app/components/Img";
import { truncate } from "app/lib/utils";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { motion } from "framer-motion";
import { Users as UsersIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface CohostsViewDialogProps {
  title?: ReactNode;
  cohostUuids: string[];
}

export type CohostsViewDialogResult = {
  confirmed: boolean;
};

let resolvePromise: ((value: CohostsViewDialogResult) => void) | null = null;

export const cohostsViewDialog = ({
  title = "Cohosts",
  cohostUuids,
}: CohostsViewDialogProps): Promise<CohostsViewDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-cohosts-view-dialog", {
      detail: {
        title,
        cohostUuids,
      },
    });
    window.dispatchEvent(event);
  });
};

// Placeholder component for loading state
const CohostPlaceholder = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 rounded-lg border border-border bg-card"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-32" />
        <div className="h-3 bg-muted rounded animate-pulse w-48" />
      </div>
    </div>
  </motion.div>
);

// Cohost card component
const CohostCard = ({ user }: { user: User }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="group relative p-3 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
  >
    <div className="flex items-center gap-2.5">
      <UserLink id={user.uuid} underline={false}>
        <div className="relative">
          <Img
            src={user.image}
            alt={user.name || "placeholder"}
            className="w-12 h-12 rounded-full border-2 border-primary/60 group-hover:border-primary transition-all duration-300"
            useImgTag
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </UserLink>
      <div className="flex-1 min-w-0">
        <UserLink id={user.uuid} underline={false}>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {user.name || "Anonymous User"}
          </h4>
        </UserLink>
        {user.uuid && (
          <p className="text-[11px] text-muted-foreground/80 font-mono mt-0.5 leading-tight">
            {truncate(user.uuid)}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export const CohostsViewDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<CohostsViewDialogProps | null>(null);
  const [cohosts, setCohosts] = useState<(User | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<CohostsViewDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);

      // Initialize placeholders
      const placeholders = new Array(event.detail.cohostUuids.length).fill(
        null
      );
      setCohosts(placeholders);

      // Fetch cohosts data
      fetchCohosts(event.detail.cohostUuids);
    };

    window.addEventListener(
      "show-cohosts-view-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-cohosts-view-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  const fetchCohosts = async (uuids: string[]) => {
    setIsLoading(true);

    try {
      // Fetch all cohosts in parallel
      const cohostPromises = uuids.map((uuid) => podiumApi.getUserData(uuid));
      const results = await Promise.allSettled(cohostPromises);

      // Map results, replacing each placeholder with actual data or keeping null on error
      const fetchedCohosts = results.map((result) => {
        if (result.status === "fulfilled" && result.value) {
          return result.value;
        }
        return null;
      });

      setCohosts(fetchedCohosts);
    } catch (error) {
      console.error("Error fetching cohosts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true });
    resolvePromise = null;
    setCohosts([]);
    setDialogContent(null);
  };

  const cohostCount = cohosts.length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-2xl max-h-[620px] flex flex-col">
        <DialogHeader className="pr-10">
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>{dialogContent?.title}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {cohostCount} cohost{cohostCount !== 1 ? "s" : ""}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Cohosts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {cohosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cohosts found</p>
            </div>
          ) : (
            cohosts.map((cohost, index) =>
              cohost ? (
                <CohostCard key={cohost.uuid} user={cohost} />
              ) : (
                <CohostPlaceholder key={`placeholder-${index}`} />
              )
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
