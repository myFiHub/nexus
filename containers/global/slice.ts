import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo, Web3Auth } from "@web3auth/modal";
import { OutpostModel, User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { injectContainer } from "app/store";
import { AptosAccount } from "aptos";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { globalSaga } from "./saga";

export interface GlobalState {
  initializingWeb3Auth: boolean;
  logingIn: boolean;
  logingOut: boolean;
  web3Auth?: Web3Auth;
  web3AuthUserInfo?: Partial<UserInfo>;
  aptosAccount?: AptosAccount;
  podiumUserInfo?: User;
  joiningOutpostId?: string;
  router?: AppRouterInstance;
  tick: number;
}

const initialState: GlobalState = {
  initializingWeb3Auth: true,
  logingIn: false,
  logingOut: false,
  tick: 0,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    initialize() {},
    startTicker() {},
    increaseTick_(state) {
      state.tick++;
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
    getAndSetWeb3AuthAccount() {},
    setWeb3AuthUserInfo(
      state,
      action: PayloadAction<Partial<UserInfo> | undefined>
    ) {
      state.web3AuthUserInfo = action.payload;
    },
    setAptosAccount(state, action: PayloadAction<AptosAccount | undefined>) {
      state.aptosAccount = action.payload;
      if (action.payload) {
        movementService.setAccount(action.payload);
      }
    },
    logout() {},
    setPodiumUserInfo(state, action: PayloadAction<User | undefined>) {
      state.podiumUserInfo = action.payload;
    },
    joinOutpost(state, action: PayloadAction<{ outpost: OutpostModel }>) {},
    setJoiingOutpostId(state, action: PayloadAction<string | undefined>) {
      state.joiningOutpostId = action.payload;
    },
    setMyUserIsOver18(state, action: PayloadAction<boolean>) {
      state.podiumUserInfo!.is_over_18 = action.payload;
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
    name: name,
    reducer: globalReducer,
    saga: globalSaga,
  });
};
