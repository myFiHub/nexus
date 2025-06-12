import { sendFollowEvent } from "app/lib/messenger";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { FollowUnfollowRequest } from "app/services/api/types";
import { all, put, takeEvery, takeLatest } from "redux-saga/effects";
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
  sendFollowEvent({ id, loading: true });
  const followUnfollowRequest: FollowUnfollowRequest = {
    uuid: id,
    action: follow ? "follow" : "unfollow",
  };

  const toastString = follow ? "Started following" : "Stopped following";
  try {
    const response = yield podiumApi.followUnfollowUser(followUnfollowRequest);
    if (response === true) {
      sendFollowEvent({ id, followed: follow });
      toast.success(`${toastString} user`);
    } else {
      sendFollowEvent({ id, loading: false });
      toast.error(`Failed to ${toastString} user`);
    }
  } catch (error) {
    toast.error(`Failed to ${toastString} user`);
  } finally {
    sendFollowEvent({ id, loading: false });
  }
}

export function* userDetailsSaga() {
  yield takeLatest(userDetailsActions.getTabsData, getTabsData);
  yield takeEvery(userDetailsActions.followUnfollowUser, followUnfollowUser);
}
