import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trade } from "app/services/api/types";
import { injectContainer } from "app/store";
import { dashboardUsersSaga } from "./saga";

export interface DashboardUsersState {
  clientSideTrades: {
    page: number;
    trades: Trade[];
    gettingTrades: boolean;
    noMoreTrades: boolean;
  };
}

export const initialState: DashboardUsersState = {
  clientSideTrades: {
    page: 1,
    trades: [],
    gettingTrades: false,
    noMoreTrades: false,
  },
};

const dashboardUsersSlice = createSlice({
  name: "dashboardUsers",
  initialState,
  reducers: {
    getClientSideTrades: () => {},
    appendClientSideTrades: (state, action: PayloadAction<Trade[]>) => {
      state.clientSideTrades.trades = [
        ...state.clientSideTrades.trades,
        ...action.payload,
      ];
      state.clientSideTrades.page = state.clientSideTrades.page + 1;
      console.log("page updated", state.clientSideTrades.page);
    },
    setClientSideTradesGettingTrades: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.clientSideTrades.gettingTrades = action.payload;
    },
    setClientSideTradesNoMoreTrades: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.clientSideTrades.noMoreTrades = action.payload;
    },
    setClientSideTradesTrades: (state, action: PayloadAction<Trade[]>) => {
      state.clientSideTrades.trades = action.payload;
    },
  },
});

export const {
  reducer: dashboardUsersReducer,
  name,
  actions: dashboardUsersActions,
} = dashboardUsersSlice;

export const useDashboardUsersSlice = () => {
  injectContainer({
    name: dashboardUsersSlice.name,
    reducer: dashboardUsersSlice.reducer,
    saga: dashboardUsersSaga,
  });
};
