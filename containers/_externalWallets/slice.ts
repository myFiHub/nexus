import {
  AptosChangeNetworkOutput,
  AptosSignAndSubmitTransactionInput,
  AptosSignAndSubmitTransactionOutput,
  AptosSignMessageInput,
  AptosSignMessageOutput,
  UserResponse,
  WalletAccount,
} from "@aptos-labs/wallet-standard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validWalletNames } from "app/components/Dialog/loginMethodSelect";
import { injectContainer } from "app/store";
import { externalWalletSaga } from "./saga";
export type Chain = {
  id: number;
  name: string;
  rpcUrl: string;
  indexerUrl?: string;
};
export type accountType = WalletAccount | undefined;
export type connectType = (walletName: validWalletNames) => void;
export type selectType = (walletName: validWalletNames) => void;
export type disconnectType = () => void;
export type signAndSubmitTransactionType = (
  input: AptosSignAndSubmitTransactionInput
) => Promise<UserResponse<AptosSignAndSubmitTransactionOutput>>;

export type signMessageType = (
  input: AptosSignMessageInput
) => Promise<UserResponse<AptosSignMessageOutput>>;

export type changeNetworkType = (
  input: number
) => Promise<UserResponse<AptosChangeNetworkOutput>>;

export interface ExternalWalletsState {
  wallets: {
    ["aptos"]: {
      connected: boolean;
      select: selectType;
      isLoading: boolean;
      account: accountType;
      chain: Chain | undefined;
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
      select: () => {},
      isLoading: false,
      account: undefined,
      chain: undefined,
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
      state.wallets[walletName].account = account as any;
    },
    setChain(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        chain: Chain | undefined;
      }>
    ) {
      const { walletName, chain } = action.payload;
      state.wallets[walletName].chain = chain;
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
    setSelect(
      state,
      action: PayloadAction<{
        walletName: keyof ExternalWalletsState["wallets"];
        select: selectType;
      }>
    ) {
      const { walletName, select } = action.payload;
      state.wallets[walletName].select = select;
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
