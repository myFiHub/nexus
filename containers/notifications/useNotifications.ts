import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { notificationsSelectors } from "./selectors";
import { notificationsActions, useNotificationsSlice } from "./slice";

export const useNotifications = () => {
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

  const markAsRead = (id: string) => {
    dispatch(notificationsActions.markNotificationAsRead(id));
  };

  const deleteNotification = (id: string) => {
    dispatch(notificationsActions.deleteNotification(id));
  };

  const refreshNotifications = () => {
    dispatch(notificationsActions.getNotifications());
  };

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    deleteNotification,
    refreshNotifications,
    isAuthenticated: !!myUser,
  };
};
