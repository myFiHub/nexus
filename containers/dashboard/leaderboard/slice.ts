import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { MostFeeEarned } from "app/services/api/types";
import { injectContainer } from "app/store";
import { leaderboardSaga } from "./saga";

export interface LeaderboardState {
  clientSideLeaderboard: {
    [LeaderboardTags.TopFeeEarned]: {
      page: number;
      users: MostFeeEarned[];
      gettingUsers: boolean;
      hasMoreData: boolean;
    };
  };
}

export const initialState: LeaderboardState = {
  clientSideLeaderboard: {
    [LeaderboardTags.TopFeeEarned]: {
      page: 1,
      users: [],
      gettingUsers: false,
      hasMoreData: true,
    },
  },
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    getClientSideLeaderboard: (
      _state,
      _action: PayloadAction<LeaderboardTags>
    ) => {},
    appendClientSideLeaderboard: (
      state,
      action: PayloadAction<{ filter: LeaderboardTags; users: MostFeeEarned[] }>
    ) => {
      const { filter, users } = action.payload;
      state.clientSideLeaderboard[filter].users = [
        ...state.clientSideLeaderboard[filter].users,
        ...users,
      ];
      state.clientSideLeaderboard[filter].page += 1;
    },
    setClientSideLeaderboardGettingUsers: (
      state,
      action: PayloadAction<{ filter: LeaderboardTags; gettingUsers: boolean }>
    ) => {
      const { filter, gettingUsers } = action.payload;
      state.clientSideLeaderboard[filter].gettingUsers = gettingUsers;
    },
    setClientSideLeaderboardHasMoreData: (
      state,
      action: PayloadAction<{ filter: LeaderboardTags; hasMoreData: boolean }>
    ) => {
      const { filter, hasMoreData } = action.payload;
      state.clientSideLeaderboard[filter].hasMoreData = hasMoreData;
    },
    setClientSideLeaderboardUsers: (
      state,
      action: PayloadAction<{ filter: LeaderboardTags; users: MostFeeEarned[] }>
    ) => {
      const { filter, users } = action.payload;
      state.clientSideLeaderboard[filter].users = users;
    },
  },
});

export const {
  reducer: leaderboardReducer,
  name,
  actions: leaderboardActions,
} = leaderboardSlice;

export const useLeaderboardSlice = () => {
  injectContainer({
    name: leaderboardSlice.name,
    reducer: leaderboardSlice.reducer,
    saga: leaderboardSaga,
  });
};
