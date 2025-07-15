import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { RootState } from "app/store";
import { initialState } from "./slice";

const dashboardUsersDomains = {
  root: (state: RootState) => state.dashboardUsers,
  clientSideTrades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades ?? initialState,
  hasMoreData: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.hasMoreData ??
    initialState.clientSideTrades.hasMoreData,
  trades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.trades ??
    initialState.clientSideTrades.trades,
  gettingTrades: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.gettingTrades ??
    initialState.clientSideTrades.gettingTrades,
  page: (state: RootState) =>
    state.dashboardUsers?.clientSideTrades?.page ??
    initialState.clientSideTrades.page,
  clientSideUsers: (state: RootState) =>
    state.dashboardUsers?.clientSideUsers ?? initialState.clientSideUsers,
};

export const dashboardUsersSelectors = {
  clientSideTrades: dashboardUsersDomains.clientSideTrades,
  hasMoreData: dashboardUsersDomains.hasMoreData,
  trades: dashboardUsersDomains.trades,
  gettingTrades: dashboardUsersDomains.gettingTrades,
  page: dashboardUsersDomains.page,
  clientSideUsers: dashboardUsersDomains.clientSideUsers,
  usersHasMoreData: (filter: UserTags) => (state: RootState) => {
    switch (filter) {
      case UserTags.RecentlyJoined:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.hasMoreData ??
          initialState.clientSideUsers[filter].hasMoreData
        );
      case UserTags.TopOwners:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.hasMoreData ??
          initialState.clientSideUsers[filter].hasMoreData
        );
    }
    return false;
  },
  usersGettingUsers: (filter: UserTags) => (state: RootState) => {
    switch (filter) {
      case UserTags.RecentlyJoined:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.gettingUsers ??
          initialState.clientSideUsers[filter].gettingUsers
        );
      case UserTags.TopOwners:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.gettingUsers ??
          initialState.clientSideUsers[filter].gettingUsers
        );
    }
    return false;
  },
  users: (filter: UserTags) => (state: RootState) => {
    switch (filter) {
      case UserTags.RecentlyJoined:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.users ??
          initialState.clientSideUsers[filter].users
        );
      case UserTags.TopOwners:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.users ??
          initialState.clientSideUsers[filter].users
        );
    }
  },
  usersPage: (filter: UserTags) => (state: RootState) => {
    switch (filter) {
      case UserTags.RecentlyJoined:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.page ??
          initialState.clientSideUsers[filter].page
        );
      case UserTags.TopOwners:
        return (
          state.dashboardUsers?.clientSideUsers[filter]?.page ??
          initialState.clientSideUsers[filter].page
        );
    }
  },
};
