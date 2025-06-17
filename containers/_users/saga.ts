import { put, takeEvery } from "redux-saga/effects";
import { usersActions } from "./slice";
import { sendFollowEvent } from "app/lib/messenger";
import { FollowUnfollowRequest } from "app/services/api/types";
import { toast } from "app/lib/toast";
import { revalidateUserProfile } from "../userDetails/serverActions/revalidateUser";
import podiumApi from "app/services/api";

function* followUnfollowUser(
  action: ReturnType<typeof usersActions.followUnfollowUser>
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
      yield put(usersActions.updateFollowStatusCache({ id, follow }));
      // invalidate user data
      revalidateUserProfile(id);
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
export function* usersSaga() {
  yield takeEvery(usersActions.followUnfollowUser, followUnfollowUser);
}
