import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const usersDomains = {
  root: (state: RootState) => state.users,
  followStatusCache: (state: RootState) => state.users?.followStatusCache || {},
};

export const usersSelectors = {
  followStatusCache: usersDomains.followStatusCache,
  isFollowedFromCache: (id: string) =>
    createSelector(
      usersDomains.followStatusCache,
      (followStatusCache) => followStatusCache[id]
    ),
};
