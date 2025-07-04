"use client";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const GlobalDomains = {
  root: (state: RootState) => state,
  router: (state: RootState) => state.global?.router,
  web3Auth: (state: RootState) => state.global?.web3Auth,
  web3AuthUserInfo: (state: RootState) => state.global?.web3AuthUserInfo,
  aptosAccount: (state: RootState) => state.global?.aptosAccount,
  initializingWeb3Auth: (state: RootState) =>
    state.global?.initializingWeb3Auth,
  initialized: (state: RootState) => !!state.global?.web3Auth,
  logingIn: (state: RootState) => state.global?.logingIn,
  logingOut: (state: RootState) => state.global?.logingOut,
  podiumUserInfo: (state: RootState) => state.global?.podiumUserInfo,
  joiningOutpostId: (state: RootState) => state.global?.joiningOutpostId,
  tick: (state: RootState) => state.global?.tick ?? 0,
  checkingOutpostForPass: (state: RootState) =>
    state.global?.checkingOutpostForPass,
  viewArchivedOutposts: (state: RootState) =>
    state.global?.viewArchivedOutposts ?? false,
  objectOfOnlineUsersToGet: (state: RootState) =>
    state.global?.objectOfOnlineUsersToGet ?? {},
  numberOfOnlineUsers: (state: RootState) =>
    state.global?.numberOfOnlineUsers ?? {},
  switchingAccount: (state: RootState) =>
    state.global?.switchingAccount ?? false,
};

export const GlobalSelectors = {
  router: GlobalDomains.router,
  web3Auth: GlobalDomains.web3Auth,
  web3AuthUserInfo: GlobalDomains.web3AuthUserInfo,
  aptosAccount: GlobalDomains.aptosAccount,
  aptosAccountAddress: (state: RootState) =>
    state.global?.aptosAccount?.address().hex(),
  isLoggedIn: (state: RootState) => !!state.global?.podiumUserInfo,
  initializingWeb3Auth: GlobalDomains.initializingWeb3Auth,
  initialized: GlobalDomains.initialized,
  logingIn: GlobalDomains.logingIn,
  logingOut: GlobalDomains.logingOut,
  podiumUserInfo: GlobalDomains.podiumUserInfo,
  joiningOutpostId: GlobalDomains.joiningOutpostId,
  tick: GlobalDomains.tick,
  checkingOutpostForPass: GlobalDomains.checkingOutpostForPass,
  viewArchivedOutposts: GlobalDomains.viewArchivedOutposts,
  numberOfOnlineUsers: GlobalDomains.numberOfOnlineUsers,
  objectOfOnlineUsersToGet: GlobalDomains.objectOfOnlineUsersToGet,
  numberOfOnlineUsersForOutpost: (id: string) =>
    createSelector(
      GlobalDomains.numberOfOnlineUsers,
      (objectOfOnlineUsers) => objectOfOnlineUsers[id] ?? 0
    ),
  switchingAccount: GlobalDomains.switchingAccount,
  isPrimaryAccount: createSelector(
    GlobalDomains.podiumUserInfo,
    (podiumUserInfo) => {
      const connectedAccounts = podiumUserInfo?.accounts ?? [];
      const currentAccount = connectedAccounts.find(
        (account) => account.address === podiumUserInfo?.address
      );
      return currentAccount?.is_primary ?? false;
    }
  ),
};
