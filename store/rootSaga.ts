import { all } from "redux-saga/effects";

// Import your feature sagas here
// Example: import { authSaga } from './features/auth/authSaga';

export function* rootSaga() {
  yield all([
    // Add your sagas here
    // Example: authSaga(),
  ]);
}
