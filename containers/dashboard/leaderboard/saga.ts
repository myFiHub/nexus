import {
  LEADERBOARD_PAGE_SIZE,
  LeaderboardTags,
} from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { GlobalSelectors } from "app/containers/global/selectors";
import podiumApi from "app/services/api";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
  User,
} from "app/services/api/types";
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
  let users: MostFeeEarned[] | MostPassHeld[] | MostUniquePassHeld[] = [];
  let hasMoreData = true;
  switch (filter) {
    case LeaderboardTags.TopFeeEarned:
      users = yield podiumApi.getMostFeeEarned({
        page,
        page_size: LEADERBOARD_PAGE_SIZE[filter],
      });
      if (users.length < LEADERBOARD_PAGE_SIZE[filter]) {
        hasMoreData = false;
      }
      break;
    case LeaderboardTags.MostPassHeld:
      users = yield podiumApi.getMostPassHeld({
        page,
        page_size: LEADERBOARD_PAGE_SIZE[filter],
      });
      if (users.length < LEADERBOARD_PAGE_SIZE[filter]) {
        hasMoreData = false;
      }
      break;
    case LeaderboardTags.MostUniquePassHolders:
      users = yield podiumApi.getMostUniquePassHolders({
        page,
        page_size: LEADERBOARD_PAGE_SIZE[filter],
      });
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

function* getCurrentUserRank(
  action: ReturnType<typeof leaderboardActions.getCurrentUserRank>
) {
  const myUser: User = yield select(GlobalSelectors.podiumUserInfo);
  if (!myUser) return;
  const aptos_address = myUser.aptos_address;
  const filter = action.payload.filter;
  const currentUserRank: {
    gettingRank: boolean;
    rank: number;
  } = yield select(leaderboardSelectors.currentUserRank(filter));
  if (!currentUserRank.rank) {
    yield put(
      leaderboardActions.setIsLoadingUserRank({ filter, isLoading: true })
    );
  }
  let users: MostFeeEarned[] | MostPassHeld[] | MostUniquePassHeld[] = [];

  try {
    switch (filter) {
      case LeaderboardTags.TopFeeEarned:
        users = yield podiumApi.getMostFeeEarned({
          aptos_address,
        });
        break;
      case LeaderboardTags.MostPassHeld:
        users = yield podiumApi.getMostPassHeld({
          aptos_address,
        });
        break;
      case LeaderboardTags.MostUniquePassHolders:
        users = yield podiumApi.getMostUniquePassHolders({
          aptos_address,
        });
        break;
    }
    let rank = 0;
    if (users[0]) {
      rank = users[0].rank;
    }
    yield put(leaderboardActions.setUserRank({ filter, rank }));
  } catch (error) {
  } finally {
    if (!currentUserRank.rank) {
      yield put(
        leaderboardActions.setIsLoadingUserRank({ filter, isLoading: false })
      );
    }
  }
}

export function* leaderboardSaga() {
  yield takeEvery(
    leaderboardActions.getClientSideLeaderboard.type,
    getClientSideLeaderboard
  );
  yield takeEvery(
    leaderboardActions.getCurrentUserRank.type,
    getCurrentUserRank
  );
}
