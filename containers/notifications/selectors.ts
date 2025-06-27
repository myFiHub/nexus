import { RootState } from "app/store";

export const notificationsDomains = {
  root: (state: RootState) => state.notifications,
  notifications: (state: RootState) => state.notifications?.notifications ?? [],
  isLoadingNotifications: (state: RootState) =>
    state.notifications?.loadingNotifications ?? false,
  errorLoadingNotifications: (state: RootState) =>
    state.notifications?.errorLoadingNotifications ?? undefined,
  unreadCount: (state: RootState) => state.notifications?.unreadCount ?? 0,
};

export const notificationsSelectors = {
  notifications: notificationsDomains.notifications,
  isLoadingNotifications: notificationsDomains.isLoadingNotifications,
  errorLoadingNotifications: notificationsDomains.errorLoadingNotifications,
  unreadCount: notificationsDomains.unreadCount,
};
