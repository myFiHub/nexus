import podiumApi from "app/services/api";
import { all, put, takeLatest } from "redux-saga/effects";
import { userDetailsActions } from "./slice";

function* getTabsData(
  action: ReturnType<typeof userDetailsActions.getTabsData>
): Generator<any, void, any> {
  let { id } = action.payload;

  if (id.length === 66) {
    const user = yield podiumApi.getUserByAptosAddress(id);
    if (user) {
      id = user.uuid;
    }
  }

  const [passBuyers, followers, followings] = yield all([
    podiumApi.podiumPassBuyers(id),
    podiumApi.getFollowersOfUser(id),
    podiumApi.getFollowingsOfUser(id),
  ]);
  yield put(
    userDetailsActions.setTabsData({
      passBuyers,
      followers,
      followings,
      loadingFollowUnfollowId: "",
    })
  );
}

export function* userDetailsSaga() {
  yield takeLatest(userDetailsActions.getTabsData, getTabsData);
}
