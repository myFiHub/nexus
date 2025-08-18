"use client";
import { WalletAccount } from "@aptos-labs/wallet-standard";
import { Chain } from "@razorlabs/razorkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo, Web3Auth } from "@web3auth/modal";
import { validWalletNames } from "app/components/Dialog/loginMethodSelect";
import { MOBILE_BREAKPOINT } from "app/hooks/use-mobile";
import {
  CookieKeys,
  getClientCookie,
  setClientCookie,
} from "app/lib/client-cookies";
import { parseTokenUriToImageUrl } from "app/lib/parseTokenUriToImageUrl";
import { OutpostModel, User } from "app/services/api/types";
import { ConnectionState, ConnectionStatus } from "app/services/wsClient";
import { injectContainer } from "app/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { globalSaga } from "./saga";

export interface GlobalState {
  initializingWeb3Auth: boolean;
  wsHealthChecking: boolean;
  logingIn: boolean;
  switchingAccount: boolean;
  isSidebarOpen: boolean;
  logingOut: boolean;
  web3Auth?: Web3Auth;
  web3AuthUserInfo?: Partial<UserInfo>;
  podiumUserInfo?: User;
  connectedExternalWallet?: validWalletNames;

  joiningOutpostId?: string;
  router?: AppRouterInstance;
  tick: number;
  wsConnectionStatus: ConnectionStatus;
  checkingOutpostForPass?: OutpostModel;
  viewArchivedOutposts?: boolean;
  objectOfOnlineUsersToGet: {
    [outpostId: string]: boolean;
  };
  numberOfOnlineUsers: { [outpostId: string]: number };
  movePrice: number;
}

export const initialState: GlobalState = {
  initializingWeb3Auth: true,
  wsHealthChecking: false,
  logingIn: false,
  switchingAccount: false,
  isSidebarOpen:
    typeof window !== "undefined"
      ? window.innerWidth > MOBILE_BREAKPOINT
      : false,
  logingOut: false,
  tick: 0,
  numberOfOnlineUsers: {},
  objectOfOnlineUsersToGet: {},
  connectedExternalWallet: undefined,
  wsConnectionStatus: {
    state: ConnectionState.DISCONNECTED,
    isConnecting: false,
    connected: false,
    hasChannel: false,
    hasToken: false,
  },
  viewArchivedOutposts:
    getClientCookie(CookieKeys.viewArchivedOutposts) === "true",
  movePrice: 0,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    getMovePrice() {},
    setMovePrice(state, action: PayloadAction<number>) {
      state.movePrice = action.payload;
    },
    initializeWeb3Auth() {},
    initOneSignal(_, __: PayloadAction<{ myId: string }>) {},
    startTicker() {},
    setIsSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
    increaseTick_(state) {
      state.tick++;
    },
    setViewArchivedOutposts(state, action: PayloadAction<boolean>) {
      state.viewArchivedOutposts = action.payload;
      setClientCookie(
        CookieKeys.viewArchivedOutposts,
        action.payload.toString()
      );
    },
    setRouter(state, action: PayloadAction<AppRouterInstance>) {
      state.router = action.payload;
    },
    setLogingIn(state, action: PayloadAction<boolean>) {
      state.logingIn = action.payload;
    },
    setLogingOut(state, action: PayloadAction<boolean>) {
      state.logingOut = action.payload;
    },
    setInitializingWeb3Auth(state, action: PayloadAction<boolean>) {
      state.initializingWeb3Auth = action.payload;
    },
    setWeb3Auth(state, action: PayloadAction<any>) {
      state.web3Auth = action.payload;
    },
    login() {},
    loginWithExternalWallet(
      state,
      action: PayloadAction<{
        account: WalletAccount;
        chain: Chain;
        selectedExternalWallet: validWalletNames;
      }>
    ) {
      const { selectedExternalWallet } = action.payload;
      state.connectedExternalWallet = selectedExternalWallet;
    },
    setWeb3AuthUserInfo(
      state,
      action: PayloadAction<Partial<UserInfo> | undefined>
    ) {
      state.web3AuthUserInfo = action.payload;
    },

    logout() {},
    setPodiumUserInfo(state, action: PayloadAction<User | undefined>) {
      const { payload } = action;
      if (payload) {
        const { image, ...rest } = payload;
        state.podiumUserInfo = {
          ...rest,
          image: parseTokenUriToImageUrl(image ?? ""),
        };
      } else {
        state.podiumUserInfo = undefined;
      }
    },
    joinOutpost(state, action: PayloadAction<{ outpost: OutpostModel }>) {},
    setJoingOutpostId(state, action: PayloadAction<string | undefined>) {
      state.joiningOutpostId = action.payload;
    },
    setMyUserIsOver18(state, action: PayloadAction<boolean>) {
      state.podiumUserInfo!.is_over_18 = action.payload;
    },
    checkIfIHavePass(
      state,
      action: PayloadAction<{ outpost: OutpostModel }>
    ) {},
    setCheckingOutpostForPass(
      state,
      action: PayloadAction<OutpostModel | undefined>
    ) {
      state.checkingOutpostForPass = action.payload;
    },

    setNumberOfOnlineUsers(
      state,
      action: PayloadAction<{ [outpostId: string]: number }>
    ) {
      state.numberOfOnlineUsers = action.payload;
    },
    toggleOutpostFromOnlineObject(
      state,
      action: PayloadAction<{ outpostId: string; addToObject: boolean }>
    ) {
      const { outpostId, addToObject } = action.payload;
      if (addToObject) {
        state.objectOfOnlineUsersToGet[outpostId] = true;
      } else {
        const { [outpostId]: _, ...rest } = state.objectOfOnlineUsersToGet;
        state.objectOfOnlineUsersToGet = rest;
      }
    },
    switchAccount() {},
    setSwitchingAccount(state, action: PayloadAction<boolean>) {
      state.switchingAccount = action.payload;
    },
    setAccountAsPrimary(state, action: PayloadAction<string>) {
      if (!state.podiumUserInfo) {
        return;
      }

      const accounts = state.podiumUserInfo.accounts.map((account) => ({
        ...account,
        is_primary: account.address === action.payload,
      }));

      state.podiumUserInfo = {
        ...state.podiumUserInfo,
        accounts,
      };
    },
    setWsConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.wsConnectionStatus = action.payload;
    },
    setWsHealthChecking(state, action: PayloadAction<boolean>) {
      state.wsHealthChecking = action.payload;
    },
  },
});

export const {
  reducer: globalReducer,
  name,
  actions: globalActions,
} = globalSlice;

export const useGlobalSlice = () => {
  injectContainer({
    name: globalSlice.name,
    reducer: globalSlice.reducer,
    saga: globalSaga,
  });
};
