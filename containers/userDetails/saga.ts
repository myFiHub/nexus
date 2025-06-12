import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { FollowUnfollowRequest } from "app/services/api/types";
import { all, put, takeLatest } from "redux-saga/effects";
import { userDetailsActions } from "./slice";

function* getTabsData(
  action: ReturnType<typeof userDetailsActions.getTabsData>
): Generator<any, void, any> {
  const { id } = action.payload;
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

function* followUnfollowUser(
  action: ReturnType<typeof userDetailsActions.followUnfollowUser>
): Generator<any, void, any> {
  const { id, follow } = action.payload;
  yield put(userDetailsActions.setLoadingFollowUnfollowId(id));
  const followUnfollowRequest: FollowUnfollowRequest = {
    uuid: id,
    action: follow ? "follow" : "unfollow",
  };

  const toastString = follow ? "Started following" : "Stopped following";
  try {
    const response = yield podiumApi.followUnfollowUser(followUnfollowRequest);
    if (response === true) {
      yield put(userDetailsActions.updateUserFollowUnfollow({ id, follow }));
      toast.success(`${toastString} user`);
    } else {
      toast.error(`Failed to ${toastString} user`);
    }
  } catch (error) {
    toast.error(`Failed to ${toastString} user`);
  } finally {
    yield put(userDetailsActions.setLoadingFollowUnfollowId(""));
  }
}

export function* userDetailsSaga() {
  yield takeLatest(userDetailsActions.getTabsData, getTabsData);
  yield takeLatest(userDetailsActions.followUnfollowUser, followUnfollowUser);
}
