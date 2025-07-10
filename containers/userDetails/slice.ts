import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowerModel, PodiumPassBuyerModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { userDetailsSaga } from "./saga";

export interface UserDetailsState {
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
  loadingFollowUnfollowId: string;
}

const initialState: UserDetailsState = {
  passBuyers: [],
  followers: [],
  followings: [],
  loadingFollowUnfollowId: "",
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    dummy: (state) => {},
    getTabsData: (state, action: PayloadAction<{ id: string }>) => {},
    setTabsData: (state, action: PayloadAction<UserDetailsState>) => {
      state.passBuyers = action.payload.passBuyers;
      state.followers = action.payload.followers;
      state.followings = action.payload.followings;
    },
  },
});

export const {
  reducer: userDetailsReducer,
  name,
  actions: userDetailsActions,
} = userDetailsSlice;

export const useUserDetailsSlice = () => {
  injectContainer({
    name: userDetailsSlice.name,
    reducer: userDetailsSlice.reducer,
    saga: userDetailsSaga,
    // No saga for userDetails
  });
  return userDetailsSlice;
};
