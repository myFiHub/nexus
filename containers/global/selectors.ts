import { RootState } from "app/store";

export const GlobalDomains = {
  root: (state: RootState) => state,
  web3Auth: (state: RootState) => state.global?.web3Auth,
  web3AuthUserInfo: (state: RootState) => state.global?.web3AuthUserInfo,
  aptosAccount: (state: RootState) => state.global?.aptosAccount,
  initializingWeb3Auth: (state: RootState) =>
    state.global?.initializingWeb3Auth,
  initialized: (state: RootState) => !!state.global?.web3Auth,
  logingIn: (state: RootState) => state.global?.logingIn,
  logingOut: (state: RootState) => state.global?.logingOut,
  podiumUserInfo: (state: RootState) => state.global?.podiumUserInfo,
};

export const GlobalSelectors = {
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
};
