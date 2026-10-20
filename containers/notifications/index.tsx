"use client";

import { Button } from "app/components/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "app/components/Popover";
import { motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { notificationsEventBus } from "./eventBus";
import { NotificationItem } from "./NotificationItem";
import { notificationsSelectors } from "./selectors";
import { notificationsActions, useNotificationsSlice } from "./slice";

const NotificationsContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  useNotificationsSlice();
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelectors.notifications);
  const isLoading = useSelector(notificationsSelectors.isLoadingNotifications);
  const error = useSelector(notificationsSelectors.errorLoadingNotifications);
  const hasLoadedOnce = useSelector(notificationsSelectors.hasLoadedOnce);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    if (myUser) {
      dispatch(notificationsActions.getNotifications());
    }
  }, [myUser, dispatch]);

  const handleRefresh = () => {
    dispatch(notificationsActions.getNotifications());
  };

  if (!myUser) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium text-foreground mb-1">
          No notifications
        </h3>
        <p className="text-xs text-muted-foreground">
          Please log in to view your notifications
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-96 min-h-[170px]">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        <div className="flex items-center gap-2">
          {isLoading && hasLoadedOnce && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && !hasLoadedOnce ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <X className="h-8 w-8 text-destructive mb-2" />
            <h3 className="text-sm font-medium text-foreground mb-1">
              Error loading notifications
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-sm font-medium text-foreground mb-1">
              No notifications
            </h3>
            <p className="text-xs text-muted-foreground">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.uuid}
                notification={notification}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationsBellProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export const NotificationsBell = ({
  className = "",
  size = "md",
  showBadge = true,
}: NotificationsBellProps) => {
  const wiggledOnceOnAppearRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const unreadCount = useSelector(notificationsSelectors.unreadCount);
  const loggedIn = !!useSelector(GlobalSelectors.podiumUserInfo);
  useEffect(() => {
    if (loggedIn && !wiggledOnceOnAppearRef.current && unreadCount > 0) {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 2000);
      wiggledOnceOnAppearRef.current = true;
    }
  }, [loggedIn]);

  useEffect(() => {
    const subscription = notificationsEventBus.subscribe(() => {
      // Trigger wiggle animation when notification is received
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 600); // Reset after animation completes
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Fetch notifications when opening the popover
      // dispatch(notificationsActions.getNotifications());
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const badgeSizeClasses = {
    sm: "h-4 w-4 text-xs",
    md: "h-5 w-5 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative ${className}`}
          aria-label={`Notifications ${
            unreadCount > 0 ? `(${unreadCount} unread)` : ""
          }`}
        >
          <motion.div
            animate={
              isWiggling
                ? {
                    rotate: [-5, 5, -5, 5, -2, 2, 0],
                    y: [0, -8, 0, -4, 0, -2, 0],
                    scale: [1, 1.1, 1, 1.05, 1, 1.02, 1],
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                    },
                  }
                : {}
            }
          >
            <Bell className={sizeClasses[size]} />
          </motion.div>
          {showBadge && unreadCount > 0 && (
            <span
              className={`absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center h-4 w-4`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <NotificationsContent onNavigate={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
