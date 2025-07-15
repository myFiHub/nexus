import { RootState } from "app/store";
import { initialState } from "./slice";

const dashboardUsersDomains = {
  root: (state: RootState) => state.dashboardUsers,
  clientSideTrades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades ?? initialState,
  noMoreTrades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.noMoreTrades ??
    initialState.clientSideTrades.noMoreTrades,
  trades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.trades ??
    initialState.clientSideTrades.trades,
  gettingTrades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.gettingTrades ??
    initialState.clientSideTrades.gettingTrades,
  page: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.page ??
    initialState.clientSideTrades.page,
};

export const dashboardUsersSelectors = {
  clientSideTrades: dashboardUsersDomains.clientSideTrades,
  noMoreTrades: dashboardUsersDomains.noMoreTrades,
  trades: dashboardUsersDomains.trades,
  gettingTrades: dashboardUsersDomains.gettingTrades,
  page: dashboardUsersDomains.page,
};
