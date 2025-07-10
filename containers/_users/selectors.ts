import { RootState } from "app/store";

export const usersDomains = {
  root: (state: RootState) => state.users,
  followStatusCache: (state: RootState) => state.users?.followStatusCache || {},
};

export const usersSelectors = {
  followStatusCache: usersDomains.followStatusCache,
  isFollowedFromCache: (id: string) => (state: RootState) =>
    (state.users?.followStatusCache || {})[id],
};
