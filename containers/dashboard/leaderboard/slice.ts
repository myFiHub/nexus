import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import {
  MostFeeEarned,
  MostPassHeld,
  MostUniquePassHeld,
} from "app/services/api/types";
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
    [LeaderboardTags.MostPassHeld]: {
      page: number;
      users: MostPassHeld[];
      gettingUsers: boolean;
      hasMoreData: boolean;
    };
    [LeaderboardTags.MostUniquePassHolders]: {
      page: number;
      users: MostUniquePassHeld[];
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
    [LeaderboardTags.MostPassHeld]: {
      page: 1,
      users: [],
      gettingUsers: false,
      hasMoreData: true,
    },
    [LeaderboardTags.MostUniquePassHolders]: {
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
      action: PayloadAction<{
        filter: LeaderboardTags;
        users: MostFeeEarned[] | MostPassHeld[] | MostUniquePassHeld[];
      }>
    ) => {
      const { filter, users } = action.payload;
      state.clientSideLeaderboard[filter].users = [
        ...state.clientSideLeaderboard[filter].users,
        ...users,
      ] as any;
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
      action: PayloadAction<{
        filter: LeaderboardTags;
        users: MostFeeEarned[] | MostPassHeld[] | MostUniquePassHeld[];
      }>
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
