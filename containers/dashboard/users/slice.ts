import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { Trade, User } from "app/services/api/types";
import { injectContainer } from "app/store";
import { dashboardUsersSaga } from "./saga";

export interface DashboardUsersState {
  clientSideTrades: {
    page: number;
    trades: Trade[];
    gettingTrades: boolean;
    hasMoreData: boolean;
  };
  clientSideUsers: {
    [UserTags.RecentlyJoined]: {
      page: number;
      users: User[];
      gettingUsers: boolean;
      hasMoreData: boolean;
    };
    [UserTags.TopOwners]: {
      page: number;
      users: User[];
      gettingUsers: boolean;
      hasMoreData: boolean;
    };
  };
}

export const initialState: DashboardUsersState = {
  clientSideTrades: {
    page: 1,
    trades: [],
    gettingTrades: false,
    hasMoreData: true,
  },
  clientSideUsers: {
    [UserTags.RecentlyJoined]: {
      page: 1,
      users: [],
      gettingUsers: false,
      hasMoreData: true,
    },
    [UserTags.TopOwners]: {
      page: 1,
      users: [],
      gettingUsers: false,
      hasMoreData: true,
    },
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
    },
    setClientSideTradesGettingTrades: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.clientSideTrades.gettingTrades = action.payload;
    },
    setClientSideTradesHasMoreData: (state, action: PayloadAction<boolean>) => {
      state.clientSideTrades.hasMoreData = action.payload;
    },
    setClientSideTradesTrades: (state, action: PayloadAction<Trade[]>) => {
      state.clientSideTrades.trades = action.payload;
    },

    // client side users
    getClientSideUsers: (_, __: PayloadAction<UserTags>) => {},
    appendClientSideUsers: (
      state,
      action: PayloadAction<{
        filter: UserTags;
        users: User[];
      }>
    ) => {
      switch (action.payload.filter) {
        case UserTags.RecentlyJoined:
          state.clientSideUsers[UserTags.RecentlyJoined].users = [
            ...state.clientSideUsers[UserTags.RecentlyJoined].users,
            ...action.payload.users,
          ];
          state.clientSideUsers[UserTags.RecentlyJoined].page =
            state.clientSideUsers[UserTags.RecentlyJoined].page + 1;
          break;
        case UserTags.TopOwners:
          state.clientSideUsers[UserTags.TopOwners].users = [
            ...state.clientSideUsers[UserTags.TopOwners].users,
            ...action.payload.users,
          ];
          state.clientSideUsers[UserTags.TopOwners].page =
            state.clientSideUsers[UserTags.TopOwners].page + 1;
          break;
      }
    },
    setClientSideUsersGettingUsers: (
      state,
      action: PayloadAction<{
        filter: UserTags;
        gettingUsers: boolean;
      }>
    ) => {
      switch (action.payload.filter) {
        case UserTags.RecentlyJoined:
          state.clientSideUsers[UserTags.RecentlyJoined].gettingUsers =
            action.payload.gettingUsers;
          break;
        case UserTags.TopOwners:
          state.clientSideUsers[UserTags.TopOwners].gettingUsers =
            action.payload.gettingUsers;
          break;
      }
    },
    setClientSideUsersHasMoreData: (
      state,
      action: PayloadAction<{
        filter: UserTags;
        hasMoreData: boolean;
      }>
    ) => {
      switch (action.payload.filter) {
        case UserTags.RecentlyJoined:
          state.clientSideUsers[UserTags.RecentlyJoined].hasMoreData =
            action.payload.hasMoreData;
          break;
        case UserTags.TopOwners:
          state.clientSideUsers[UserTags.TopOwners].hasMoreData =
            action.payload.hasMoreData;
          break;
      }
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
