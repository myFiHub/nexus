import {
  LeaderboardTags,
  TOP_FEE_EARNED_PAGE_SIZE,
} from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import podiumApi from "app/services/api";
import { put, select, takeLatest } from "redux-saga/effects";
import { leaderboardSelectors } from "./selectors";
import { leaderboardActions } from "./slice";

function* getClientSideLeaderboard(
  action: ReturnType<typeof leaderboardActions.getClientSideLeaderboard>
) {
  const filter = action.payload;
  const page: number = yield select(leaderboardSelectors.page(filter));
  yield put(
    leaderboardActions.setClientSideLeaderboardGettingUsers({
      filter,
      gettingUsers: true,
    })
  );
  let users = [];
  let hasMoreData = true;
  switch (filter) {
    case LeaderboardTags.TopFeeEarned:
      users = yield podiumApi.getMostFeeEarned(page, TOP_FEE_EARNED_PAGE_SIZE);
      if (users.length < TOP_FEE_EARNED_PAGE_SIZE) {
        hasMoreData = false;
      }
      break;
    default:
      break;
  }
  yield put(
    leaderboardActions.setClientSideLeaderboardHasMoreData({
      filter,
      hasMoreData,
    })
  );
  yield put(leaderboardActions.appendClientSideLeaderboard({ filter, users }));
  yield put(
    leaderboardActions.setClientSideLeaderboardGettingUsers({
      filter,
      gettingUsers: false,
    })
  );
}

export function* leaderboardSaga() {
  yield takeLatest(
    leaderboardActions.getClientSideLeaderboard.type,
    getClientSideLeaderboard
  );
}
