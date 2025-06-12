import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const userDetailsDomains = {
  root: (state: RootState) => state.userDetails,
};

export const userDetailsSelectors = {
  passBuyers: (state: RootState) => state.userDetails.passBuyers,
  followers: (state: RootState) => state.userDetails.followers,
  followings: (state: RootState) => state.userDetails.followings,
  followedByMe: (id: string) =>
    createSelector([userDetailsDomains.root], (state) => {
      const followers = state?.followers || [];
      const followings = state?.followings || [];
      const passBuyers = state?.passBuyers || [];
      const flattened = [...followers, ...followings, ...passBuyers];
      console.log({ flattened, id });
      const user = flattened.find(
        (user) => user.uuid === id && user.followed_by_me
      );
      return !!user?.followed_by_me;
    }),
  loadingFollowUnfollowId: (state: RootState) =>
    state.userDetails.loadingFollowUnfollowId,
};
