import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { notificationsSaga } from "./saga";

export interface NotificationsState {
  notifications: NotificationModel[];
  loadingNotifications: boolean;
  errorLoadingNotifications?: string;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  loadingNotifications: false,
  errorLoadingNotifications: undefined,
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoadingNotifications: (state, action: PayloadAction<boolean>) => {
      state.loadingNotifications = action.payload;
    },
    setErrorLoadingNotifications: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.errorLoadingNotifications = action.payload;
    },
    getNotifications: (state) => {},
    setNotifications: (state, action: PayloadAction<NotificationModel[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.uuid === action.payload
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.uuid === action.payload
      );
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.uuid !== action.payload
      );
    },
    addNotification: (state, action: PayloadAction<NotificationModel>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
  },
});

export const {
  reducer: notificationsReducer,
  name,
  actions: notificationsActions,
} = notificationsSlice;

export const useNotificationsSlice = () => {
  injectContainer({
    name: name,
    reducer: notificationsReducer,
    saga: notificationsSaga,
  });
};
