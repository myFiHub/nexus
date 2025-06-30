import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { injectContainer } from "app/store";
import { usersSaga } from "./saga";

export interface UsersState {
  followStatusCache: {
    [key: string]: boolean;
  };
  // Empty state type as requested
}

const initialState: UsersState = {
  followStatusCache: {},
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    followUnfollowUser: (
      state,
      action: PayloadAction<{ id: string; follow: boolean }>
    ) => {},
    updateFollowStatusCache: (
      state,
      action: PayloadAction<{ id: string; follow: boolean }>
    ) => {
      state.followStatusCache[action.payload.id] = action.payload.follow;
    },
  },
});

export const {
  reducer: usersReducer,
  name,
  actions: usersActions,
} = usersSlice;

export const useUsersSlice = () => {
  injectContainer({
    name: name,
    reducer: usersReducer,
    saga: usersSaga,
  });
};
