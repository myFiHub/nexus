import podiumApi from "app/services/api";
import { Trade } from "app/services/api/types";
import { put, select, takeLatest } from "redux-saga/effects";
import { TRADE_PAGE_SIZE } from "./configs";
import { dashboardUsersSelectors } from "./selectors";
import { dashboardUsersActions } from "./slice";

function* getClientSideTrades() {
  const page: number = yield select(dashboardUsersSelectors.page);
  console.log("page", page);
  yield put(dashboardUsersActions.setClientSideTradesGettingTrades(true));
  const trades: Trade[] = yield podiumApi.getTrades(page, TRADE_PAGE_SIZE);
  if (trades.length < TRADE_PAGE_SIZE) {
    yield put(dashboardUsersActions.setClientSideTradesNoMoreTrades(true));
  }
  yield put(dashboardUsersActions.appendClientSideTrades(trades));
  yield put(dashboardUsersActions.setClientSideTradesGettingTrades(false));
}

export function* dashboardUsersSaga() {
  yield takeLatest(
    dashboardUsersActions.getClientSideTrades.type,
    getClientSideTrades
  );
}
