import {
  AccountInfo,
  AptosChangeNetworkOutput,
  AptosSignAndSubmitTransactionOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  InputTransactionData,
  Network,
  NetworkInfo,
} from "@aptos-labs/wallet-adapter-core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validWalletNames } from "app/components/Dialog/loginMethodSelectDialog";
import { injectContainer } from "app/store";
import { externalWalletSaga } from "./saga";

export type accountType = AccountInfo | null;
export type networkType = NetworkInfo | null;
export type connectType = (walletName: validWalletNames) => void;
export type disconnectType = () => void;
export type signAndSubmitTransactionType = (
  transaction: InputTransactionData
) => Promise<AptosSignAndSubmitTransactionOutput>;
export type signMessageType = (
  message: AptosSignMessageInput
) => Promise<AptosSignMessageOutput>;
export type changeNetworkType = (
  network: Network
) => Promise<AptosChangeNetworkOutput>;

export interface ExternalWalletsState {
  wallets: {
    ["aptos"]: {
      connected: boolean;
      isLoading: boolean;
      account: accountType;
      network: networkType;
      connect: connectType;
      disconnect: disconnectType;
      signAndSubmitTransaction?: signAndSubmitTransactionType;
      signMessage?: signMessageType;
      changeNetwork?: changeNetworkType;
    };
  };
}

const initialState: ExternalWalletsState = {
  wallets: {
    aptos: {
      connected: false,
      isLoading: false,
      account: null,
      network: null,
      connect: () => {},
      disconnect: () => {},
      signAndSubmitTransaction: undefined,
      signMessage: undefined,
    },
  },
};

const externalWalletSlice = createSlice({
  name: "externalWallets",
  initialState,
  reducers: {
    setConnected(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        connected: boolean;
      }>
    ) {
      const { walletName, connected } = action.payload;
      state.wallets[walletName].connected = connected;
    },
    setAccount(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        account: accountType;
      }>
    ) {
      const { walletName, account } = action.payload;
      state.wallets[walletName].account = account;
    },
    setNetwork(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        network: networkType;
      }>
    ) {
      const { walletName, network } = action.payload;
      state.wallets[walletName].network = network;
    },
    setIsLoading(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        isLoading: boolean;
      }>
    ) {
      const { walletName, isLoading } = action.payload;
      state.wallets[walletName].isLoading = isLoading;
    },
    setConnect(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        connect: connectType;
      }>
    ) {
      const { walletName, connect } = action.payload;
      state.wallets[walletName].connect = connect;
    },
    setDisconnect(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        disconnect: disconnectType;
      }>
    ) {
      const { walletName, disconnect } = action.payload;
      state.wallets[walletName].disconnect = disconnect;
    },
    setSignAndSubmitTransaction(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        signAndSubmitTransaction: signAndSubmitTransactionType;
      }>
    ) {
      const { walletName, signAndSubmitTransaction } = action.payload;
      state.wallets[walletName].signAndSubmitTransaction =
        signAndSubmitTransaction;
    },
    setSignMessage(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        signMessage: signMessageType;
      }>
    ) {
      const { walletName, signMessage } = action.payload;
      state.wallets[walletName].signMessage = signMessage;
    },
    setChangeNetwork(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        changeNetwork: changeNetworkType;
      }>
    ) {
      const { walletName, changeNetwork } = action.payload;
      state.wallets[walletName].changeNetwork = changeNetwork;
    },
  },
});

export const {
  reducer: externalWalletReducer,
  name,
  actions: externalWalletActions,
} = externalWalletSlice;

export const useExternalWalletSlice = () => {
  // Lazy import to avoid circular dependency
  injectContainer({
    name: externalWalletSlice.name,
    reducer: externalWalletSlice.reducer,
    saga: externalWalletSaga,
  });
};
