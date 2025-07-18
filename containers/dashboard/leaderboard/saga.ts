import {
  LEADERBOARD_PAGE_SIZE,
  LeaderboardTags,
} from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import podiumApi from "app/services/api";
import { put, select, takeEvery } from "redux-saga/effects";
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
      users = yield podiumApi.getMostFeeEarned(
        page,
        LEADERBOARD_PAGE_SIZE[filter]
      );
      if (users.length < LEADERBOARD_PAGE_SIZE[filter]) {
        hasMoreData = false;
      }
      break;
    case LeaderboardTags.MostPassHeld:
      users = yield podiumApi.getMostPassHeld(
        page,
        LEADERBOARD_PAGE_SIZE[filter]
      );
      if (users.length < LEADERBOARD_PAGE_SIZE[filter]) {
        hasMoreData = false;
      }
      break;
    case LeaderboardTags.MostUniquePassHolders:
      users = yield podiumApi.getMostUniquePassHolders(
        page,
        LEADERBOARD_PAGE_SIZE[filter]
      );
      if (users.length < LEADERBOARD_PAGE_SIZE[filter]) {
        hasMoreData = false;
      }
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
  yield takeEvery(
    leaderboardActions.getClientSideLeaderboard.type,
    getClientSideLeaderboard
  );
}
