"use client";

import OutpostLink from "app/components/AppLink/outpostLink";
import { Button } from "app/components/Button";
import { ReduxProvider } from "app/store/Provider";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useEffect } from "react";
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
      const outpostName = notification.invite_metadata.outpost_name;
      const outpostId = notification.invite_metadata.outpost_uuid;

      return {
        title: "Outpost Invitation",
        message: (
          <span>
            {notification.invite_metadata.inviter_name} invited you to join{" "}
            <OutpostLink
              id={outpostId}
              className="text-blue-600 hover:text-blue-800 no-underline p-0 m-0 h-[20px]"
              underline={false}
            >
              "{outpostName}"
            </OutpostLink>
          </span>
        ),
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

const NotificationsPageContent = () => {
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
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <Bell className="h-16 w-16 text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Notifications
        </h1>
        <p className="text-gray-500 text-lg">
          Please log in to view your notifications
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <X className="h-16 w-16 text-red-400 mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Error loading notifications
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button
              onClick={() => dispatch(notificationsActions.getNotifications())}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              You're all caught up! Check back later for new updates.
            </p>
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

export const NotificationsPage = () => {
  return (
    <ReduxProvider>
      <NotificationsPageContent />
    </ReduxProvider>
  );
};
