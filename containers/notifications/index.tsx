"use client";

import { Button } from "app/components/Button";
import { Dialog, DialogContent, DialogTrigger } from "app/components/Dialog";
import { ReduxProvider } from "app/store/Provider";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { notificationsSelectors } from "./selectors";
import { notificationsActions, useNotificationsSlice } from "./slice";

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getNotificationContent = () => {
    if (
      notification.notification_type === "follow" &&
      notification.follow_metadata
    ) {
      return {
        title: "New Follower",
        message: `${notification.follow_metadata.follower_name} started following you`,
        image: notification.follow_metadata.follower_image,
      };
    } else if (
      notification.notification_type === "invite" &&
      notification.invite_metadata
    ) {
      return {
        title: "Outpost Invitation",
        message: `${notification.invite_metadata.inviter_name} invited you to join "${notification.invite_metadata.outpost_name}"`,
        image: notification.invite_metadata.inviter_image,
      };
    }
    return {
      title: "Notification",
      message: notification.message,
      image: null,
    };
  };

  const content = getNotificationContent();

  return (
    <div
      className={`flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        !notification.is_read ? "bg-blue-50" : ""
      }`}
    >
      {content.image && (
        <img
          src={content.image}
          alt="User"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">
              {content.title}
            </h4>
            <p className="text-gray-600 text-sm mt-1">{content.message}</p>
            <p className="text-gray-400 text-xs mt-2">
              {formatTime(notification.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.uuid)}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.uuid)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsContent = () => {
  useNotificationsSlice();
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelectors.notifications);
  const isLoading = useSelector(notificationsSelectors.isLoadingNotifications);
  const error = useSelector(notificationsSelectors.errorLoadingNotifications);
  const unreadCount = useSelector(notificationsSelectors.unreadCount);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    if (myUser) {
      dispatch(notificationsActions.getNotifications());
    }
  }, [myUser, dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(notificationsActions.markNotificationAsRead(id));
  };

  const handleDelete = (id: string) => {
    dispatch(notificationsActions.deleteNotification(id));
  };

  if (!myUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No notifications
        </h3>
        <p className="text-gray-500">
          Please log in to view your notifications
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <X className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading notifications
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              onClick={() => dispatch(notificationsActions.getNotifications())}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.uuid}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useSelector(notificationsSelectors.unreadCount);

  return (
    <ReduxProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium h-5 w-5 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0">
          <NotificationsContent />
        </DialogContent>
      </Dialog>
    </ReduxProvider>
  );
};

// Export the page component and hook
export { NotificationsBell } from "./NotificationsBell";
export { NotificationsPage } from "./NotificationsPage";
export { useNotifications } from "./useNotifications";
