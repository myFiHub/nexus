import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { notificationsSaga } from "./saga";

export interface NotificationsState {
  notifications: NotificationModel[];
  loadingNotifications: boolean;
  errorLoadingNotifications?: string;
  hasLoadedOnce: boolean;
}

// Mock notification data for demonstration
const mockNotifications: NotificationModel[] = [
  {
    uuid: "1",
    created_at: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
    is_read: false,
    message: "You have a new follower!",
    notification_type: "follow",
    follow_metadata: {
      follower_uuid: "user-1",
      follower_name: "Alice Johnson",
      follower_image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
  },
  {
    uuid: "2",
    created_at: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
    is_read: false,
    message: "You've been invited to join an outpost!",
    notification_type: "invite",
    invite_metadata: {
      inviter_uuid: "user-2",
      inviter_name: "Bob Smith",
      inviter_image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      outpost_uuid: "outpost-1",
      outpost_name: "Tech Innovators Hub",
      outpost_image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop",
      action: "enter",
    },
  },
  {
    uuid: "3",
    created_at: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    is_read: true,
    message: "Welcome to Podium Nexus!",
    notification_type: "follow",
    follow_metadata: {
      follower_uuid: "user-3",
      follower_name: "Carol Davis",
      follower_image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  },
  {
    uuid: "4",
    created_at: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
    is_read: false,
    message: "You've been invited to speak at an outpost!",
    notification_type: "invite",
    invite_metadata: {
      inviter_uuid: "user-4",
      inviter_name: "David Wilson",
      inviter_image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      outpost_uuid: "outpost-2",
      outpost_name: "Creative Minds Collective",
      outpost_image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop",
      action: "speak",
    },
  },
  {
    uuid: "5",
    created_at: Math.floor(Date.now() / 1000) - 14400, // 4 hours ago
    is_read: true,
    message: "Your outpost 'Web3 Discussion' is starting soon!",
    notification_type: "invite",
    invite_metadata: {
      inviter_uuid: "user-5",
      inviter_name: "Emma Brown",
      inviter_image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      outpost_uuid: "outpost-3",
      outpost_name: "Web3 Discussion",
      outpost_image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop",
      action: "enter",
    },
  },
  {
    uuid: "6",
    created_at: Math.floor(Date.now() / 1000) - 28800, // 8 hours ago
    is_read: false,
    message: "New follower alert!",
    notification_type: "follow",
    follow_metadata: {
      follower_uuid: "user-6",
      follower_name: "Frank Miller",
      follower_image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
  },
];

const initialState: NotificationsState = {
  notifications: [],
  loadingNotifications: false,
  errorLoadingNotifications: undefined,
  hasLoadedOnce: false,
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
    getNotifications: (state) => {
      state.hasLoadedOnce = true;
    },
    setNotifications: (state, action: PayloadAction<NotificationModel[]>) => {
      state.notifications = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.uuid === action.payload
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
      }
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.uuid !== action.payload
      );
    },
    addNotification: (state, action: PayloadAction<NotificationModel>) => {
      state.notifications.unshift(action.payload);
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
