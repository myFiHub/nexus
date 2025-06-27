import podiumApi from "app/services/api";
import { NotificationModel } from "app/services/api/types";
import { put, takeLatest } from "redux-saga/effects";
import { notificationsActions } from "./slice";

function* getNotifications() {
  try {
    yield put(notificationsActions.setErrorLoadingNotifications(undefined));
    yield put(notificationsActions.setLoadingNotifications(true));

    const notifications: NotificationModel[] =
      yield podiumApi.getNotifications();
    yield put(notificationsActions.setNotifications(notifications));
  } catch (error) {
    yield put(
      notificationsActions.setErrorLoadingNotifications(
        "Error loading notifications"
      )
    );
  } finally {
    yield put(notificationsActions.setLoadingNotifications(false));
  }
}

function* markNotificationAsRead(
  action: ReturnType<typeof notificationsActions.markNotificationAsRead>
) {
  try {
    const success: boolean = yield podiumApi.markNotificationAsRead(
      action.payload
    );
    if (success) {
      yield put(notificationsActions.markNotificationAsRead(action.payload));
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

function* deleteNotification(
  action: ReturnType<typeof notificationsActions.deleteNotification>
) {
  try {
    const success: boolean = yield podiumApi.deleteNotification(action.payload);
    if (success) {
      yield put(notificationsActions.deleteNotification(action.payload));
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}

export function* notificationsSaga() {
  yield takeLatest(notificationsActions.getNotifications, getNotifications);
  yield takeLatest(
    notificationsActions.markNotificationAsRead,
    markNotificationAsRead
  );
  yield takeLatest(notificationsActions.deleteNotification, deleteNotification);
}
