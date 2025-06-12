import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { put, takeLatest } from "redux-saga/effects";
import { profileActions } from "./slice";

function* fetchProfile() {
  try {
    const user: User | undefined = yield podiumApi.getMyUserData({});
    if (!user) {
      yield put(
        profileActions.setUserError("there was an error fetching your profile")
      );
      return;
    }
    yield put(profileActions.setUser(user));
  } catch (error) {
    console.error(error);
  }
}

export function* profileSaga() {
  yield takeLatest(profileActions.fetchProfile, fetchProfile);
}
