"use client";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { initialState } from "./slice";

// Define domain selectors as individual functions first
const root = (state: RootState) => state;
const router = (state: RootState) => state.global?.router;
const web3Auth = (state: RootState) => state.global?.web3Auth;
const web3AuthUserInfo = (state: RootState) => state.global?.web3AuthUserInfo;
const aptosAccount = (state: RootState) => state.global?.aptosAccount;
const initializingWeb3Auth = (state: RootState) =>
  state.global?.initializingWeb3Auth;
const initialized = (state: RootState) => !!state.global?.web3Auth;
const logingIn = (state: RootState) => state.global?.logingIn;
const wsConnectionStatus = (state: RootState) =>
  state.global?.wsConnectionStatus ?? initialState.wsConnectionStatus;
const logingOut = (state: RootState) => state.global?.logingOut;
const podiumUserInfo = (state: RootState) => state.global?.podiumUserInfo;
const joiningOutpostId = (state: RootState) => state.global?.joiningOutpostId;
const tick = (state: RootState) => state.global?.tick ?? 0;
const checkingOutpostForPass = (state: RootState) =>
  state.global?.checkingOutpostForPass;
const viewArchivedOutposts = (state: RootState) =>
  state.global?.viewArchivedOutposts ?? false;
const objectOfOnlineUsersToGet = (state: RootState) =>
  state.global?.objectOfOnlineUsersToGet ?? {};
const numberOfOnlineUsers = (state: RootState) =>
  state.global?.numberOfOnlineUsers ?? {};
const switchingAccount = (state: RootState) =>
  state.global?.switchingAccount ?? false;

export const GlobalDomains = {
  root,
  router,
  web3Auth,
  web3AuthUserInfo,
  aptosAccount,
  initializingWeb3Auth,
  initialized,
  logingIn,
  wsConnectionStatus,
  logingOut,
  podiumUserInfo,
  joiningOutpostId,
  tick,
  checkingOutpostForPass,
  viewArchivedOutposts,
  objectOfOnlineUsersToGet,
  numberOfOnlineUsers,
  switchingAccount,
};

// Define selector functions first
const aptosAccountAddress = (state: RootState) =>
  state.global?.aptosAccount?.address().hex();
const isLoggedIn = (state: RootState) => !!state.global?.podiumUserInfo;
const numberOfOnlineUsersForOutpost = (id: string) =>
  createSelector(
    numberOfOnlineUsers,
    (objectOfOnlineUsers) => objectOfOnlineUsers[id] ?? 0
  );
const isPrimaryAccount = createSelector(podiumUserInfo, (podiumUserInfo) => {
  const connectedAccounts = podiumUserInfo?.accounts ?? [];
  if (connectedAccounts.length === 0) return true;
  const currentAccount = connectedAccounts.find(
    (account) => account.address === podiumUserInfo?.address
  );
  return currentAccount?.is_primary ?? false;
});

export const GlobalSelectors = {
  router,
  web3Auth,
  web3AuthUserInfo,
  aptosAccount,
  aptosAccountAddress,
  isLoggedIn,
  initializingWeb3Auth,
  initialized,
  logingIn,
  wsConnectionStatus,
  logingOut,
  podiumUserInfo,
  joiningOutpostId,
  tick,
  checkingOutpostForPass,
  viewArchivedOutposts,
  numberOfOnlineUsers,
  objectOfOnlineUsersToGet,
  numberOfOnlineUsersForOutpost,
  switchingAccount,
  isPrimaryAccount,
};
