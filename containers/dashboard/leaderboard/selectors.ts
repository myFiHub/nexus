import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { RootState } from "app/store";
import { initialState } from "./slice";

const leaderboardDomains = {
  clientSideLeaderboard: (state: RootState) =>
    state.leaderboard?.clientSideLeaderboard ??
    initialState.clientSideLeaderboard,
};

export const leaderboardSelectors = {
  clientSideLeaderboard: leaderboardDomains.clientSideLeaderboard,
  hasMoreData: (filter: LeaderboardTags) => (state: RootState) => {
    return (
      state.leaderboard?.clientSideLeaderboard[filter]?.hasMoreData ??
      initialState.clientSideLeaderboard[filter].hasMoreData
    );
  },
  gettingUsers: (filter: LeaderboardTags) => (state: RootState) => {
    return (
      state.leaderboard?.clientSideLeaderboard[filter]?.gettingUsers ??
      initialState.clientSideLeaderboard[filter].gettingUsers
    );
  },
  users: (filter: LeaderboardTags) => (state: RootState) => {
    return (
      state.leaderboard?.clientSideLeaderboard[filter]?.users ??
      initialState.clientSideLeaderboard[filter].users
    );
  },
  page: (filter: LeaderboardTags) => (state: RootState) => {
    return (
      state.leaderboard?.clientSideLeaderboard[filter]?.page ??
      initialState.clientSideLeaderboard[filter].page
    );
  },
  currentUserRank: (filter: LeaderboardTags) => (state: RootState) => {
    return (
      state.leaderboard?.currentUserRank[filter] ??
      initialState.currentUserRank[filter]
    );
  },
};
