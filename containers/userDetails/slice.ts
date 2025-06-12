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
    getTabsData: (state, action: PayloadAction<{ id: string }>) => {},
    setTabsData: (state, action: PayloadAction<UserDetailsState>) => {
      state.passBuyers = action.payload.passBuyers;
      state.followers = action.payload.followers;
      state.followings = action.payload.followings;
    },
    followUnfollowUser: (
      state,
      action: PayloadAction<{ id: string; follow: boolean }>
    ) => {},
    setLoadingFollowUnfollowId: (state, action: PayloadAction<string>) => {
      state.loadingFollowUnfollowId = action.payload;
    },

    updateUserFollowUnfollow: (
      state,
      action: PayloadAction<{ id: string; follow: boolean }>
    ) => {
      const { id, follow } = action.payload;
      const updateFollowing = (users: any[], id: string, follow: boolean) => {
        return users.map((user) =>
          user.uuid === id ? { ...user, followed_by_me: follow } : user
        );
      };

      state.followers = updateFollowing(state.followers, id, follow);
      state.followings = updateFollowing(state.followings, id, follow);
      state.passBuyers = updateFollowing(state.passBuyers, id, follow);
      console.log({
        followers: state.followers,
        followings: state.followings,
        passBuyers: state.passBuyers,
      });
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
    name: name,
    reducer: userDetailsReducer,
    saga: userDetailsSaga,
    // No saga for userDetails
  });
};
