import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const notificationsDomains = {
  root: (state: RootState) => state.notifications,
  notifications: (state: RootState) => state.notifications?.notifications ?? [],
  isLoadingNotifications: (state: RootState) =>
    state.notifications?.loadingNotifications ?? false,
  errorLoadingNotifications: (state: RootState) =>
    state.notifications?.errorLoadingNotifications ?? undefined,
  hasLoadedOnce: (state: RootState) =>
    state.notifications?.hasLoadedOnce ?? false,
};

export const notificationsSelectors = {
  notifications: notificationsDomains.notifications,
  isLoadingNotifications: notificationsDomains.isLoadingNotifications,
  errorLoadingNotifications: notificationsDomains.errorLoadingNotifications,
  unreadCount: createSelector(
    [notificationsDomains.notifications],
    (notifications) => {
      return notifications.filter((n) => !n.is_read).length;
    }
  ),
  hasLoadedOnce: notificationsDomains.hasLoadedOnce,
};
