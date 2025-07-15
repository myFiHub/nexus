import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import podiumApi from "app/services/api";
import { Trade, User } from "app/services/api/types";
import { put, select, takeLatest } from "redux-saga/effects";
import {
  RECENTLY_JOINED_PAGE_SIZE,
  TOP_OWNERS_PAGE_SIZE,
  TRADE_PAGE_SIZE,
} from "./configs";
import { dashboardUsersSelectors } from "./selectors";
import { dashboardUsersActions } from "./slice";

function* getClientSideTrades() {
  const page: number = yield select(dashboardUsersSelectors.page);
  yield put(dashboardUsersActions.setClientSideTradesGettingTrades(true));
  const trades: Trade[] = yield podiumApi.getTrades(page, TRADE_PAGE_SIZE);
  if (trades.length < TRADE_PAGE_SIZE) {
    yield put(dashboardUsersActions.setClientSideTradesHasMoreData(false));
  }
  yield put(dashboardUsersActions.appendClientSideTrades(trades));
  yield put(dashboardUsersActions.setClientSideTradesGettingTrades(false));
}

function* getClientSideUsers(
  action: ReturnType<typeof dashboardUsersActions.getClientSideUsers>
) {
  const filter = action.payload;
  const page: number = yield select(dashboardUsersSelectors.usersPage(filter));
  console.log("page", page);
  yield put(
    dashboardUsersActions.setClientSideUsersGettingUsers({
      filter,
      gettingUsers: true,
    })
  );
  let users: User[] = [];
  let hasMoreData: boolean = true;
  switch (filter) {
    case UserTags.RecentlyJoined:
      users = yield podiumApi.getRecentlyJoinedUsers(
        page,
        RECENTLY_JOINED_PAGE_SIZE
      );
      if (users.length < RECENTLY_JOINED_PAGE_SIZE) {
        hasMoreData = false;
      }
      break;
    case UserTags.TopOwners:
      users = yield podiumApi.getTopOwners(page, TOP_OWNERS_PAGE_SIZE);
      if (users.length < TOP_OWNERS_PAGE_SIZE) {
        hasMoreData = false;
      }
      break;
  }
  yield put(
    dashboardUsersActions.setClientSideUsersHasMoreData({ filter, hasMoreData })
  );
  yield put(dashboardUsersActions.appendClientSideUsers({ filter, users }));
  yield put(
    dashboardUsersActions.setClientSideUsersGettingUsers({
      filter,
      gettingUsers: false,
    })
  );
}

export function* dashboardUsersSaga() {
  yield takeLatest(
    dashboardUsersActions.getClientSideTrades.type,
    getClientSideTrades
  );
  yield takeLatest(
    dashboardUsersActions.getClientSideUsers.type,
    getClientSideUsers
  );
}
