import { notificationsSaga } from "app/containers/notifications/saga";
import { all } from "redux-saga/effects";

// Import your feature sagas here
// Example: import { authSaga } from './features/auth/authSaga';

export function* rootSaga() {
  yield all([
    // Add your sagas here
    // Example: authSaga(),
    notificationsSaga(),
  ]);
}
