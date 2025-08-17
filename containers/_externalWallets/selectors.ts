import { RootState } from "app/store";
import { ExternalWalletsState } from "./slice";

export const externalWalletsDomains = {
  root: (state: RootState) => state.externalWallets,
  wallets: (state: RootState) => state.externalWallets.wallets,
  aptos: (state: RootState) => state.externalWallets.wallets.aptos,
};

export const externalWalletsSelectors = {
  root: externalWalletsDomains.root,
  connected:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].connected,
  isLoading:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].isLoading,
  account:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].account,

  disconnect:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].disconnect,
  signAndSubmitTransaction:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName]
        .signAndSubmitTransaction,
  signMessage:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].signMessage,
  changeNetwork:
    (walletName: keyof ExternalWalletsState["wallets"]) => (state: RootState) =>
      externalWalletsDomains.wallets(state)[walletName].changeNetwork,
};
