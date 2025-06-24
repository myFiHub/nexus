import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  OutpostModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";
import { injectContainer } from "app/store";
import { assetsSaga } from "./saga";

export interface Balance {
  value: string;
  loading: boolean;
  error?: string;
}

export interface PassSeller {
  uuid: string;
  name: string;
  image: string;
  aptos_address: string;
  accessIfIBuy: "enter" | "speak" | "enterAndSpeak";
  price: string;
  buying: boolean;
  bought: boolean;
  error?: string;
  userInfo: User;
}

export interface Pass {
  price: string;
  ownedNumber: number;
  error?: string;
  loading?: boolean;
}
export interface AssetsState {
  balance: Balance;
  passes: {
    [key: string]: Pass;
  };
  passesListBoughtByMe: {
    loading: boolean;
    passes: PodiumPassBuyerModel[];
    error?: string;
    page: number;
  };
  myPasses: {
    loading: boolean;
    passes: Pass[];
  };
  outpostPassSellers: {
    [outpostId: string]: {
      loading: boolean;
      sellers: PassSeller[];
      error?: string;
    };
  };
}

const initialState: AssetsState = {
  passes: {},
  balance: {
    value: "",
    loading: false,
    error: undefined,
  },
  myPasses: {
    loading: false,
    passes: [],
  },
  passesListBoughtByMe: {
    loading: false,
    passes: [],
    error: undefined,
    page: 0,
  },
  outpostPassSellers: {},
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    getBalance() {},
    setBalance(state, action: PayloadAction<Balance>) {
      state.balance = action.payload;
    },
    getUserPassInfo(state, action: PayloadAction<{ address: string }>) {},
    getPassesBoughtByMe(state, action: PayloadAction<{ page: number }>) {},
    setIsGettingMyPasses(state, action: PayloadAction<boolean>) {
      state.myPasses.loading = action.payload;
    },
    setMyPasses(state, action: PayloadAction<Pass[]>) {
      state.myPasses.passes = action.payload;
    },
    setUserPassInfo(
      state,
      action: PayloadAction<{ address: string; pass: Pass }>
    ) {
      const { address, pass } = action.payload;
      state.passes[address] = pass;
    },
    buyPassFromUser(
      state,
      action: PayloadAction<{
        user: User;
        numberOfTickets: number;
        buyingToHaveAccessToOutpostWithId?: string;
      }>
    ) {},
    sellOneOfMyBoughtPasses(
      state,
      action: PayloadAction<{ pass: PodiumPassBuyerModel }>
    ) {},
    setPassesListBoughtByMePage(state, action: PayloadAction<number>) {
      state.passesListBoughtByMe.page = action.payload;
    },
    setPassesListBoughtByMe(
      state,
      action: PayloadAction<{
        passes: PodiumPassBuyerModel[];
      }>
    ) {
      state.passesListBoughtByMe.passes = action.payload.passes;
    },
    setPassesListBoughtByMeLoading(state, action: PayloadAction<boolean>) {
      state.passesListBoughtByMe.loading = action.payload;
    },
    setPassesListBoughtByMeError(state, action: PayloadAction<string>) {
      state.passesListBoughtByMe.error = action.payload;
    },

    setOutpostPassSellers(
      state,
      action: PayloadAction<{
        outpost: OutpostModel;
        passes: PassSeller[];
      }>
    ) {
      const { outpost, passes } = action.payload;
      state.outpostPassSellers[outpost.uuid] = {
        loading: false,
        sellers: passes,
        error: undefined,
      };
    },
    updateOutpostPassSeller(
      state,
      action: PayloadAction<{ outpostId: string; pass: PassSeller }>
    ) {
      const { outpostId, pass } = action.payload;
      const outpostPassSellers = state.outpostPassSellers[outpostId];
      if (!outpostPassSellers) return;
      outpostPassSellers.sellers = outpostPassSellers.sellers.map((p) =>
        p.uuid === pass.uuid ? pass : p
      );
    },
    setIsGettingOutpostPassSellers(
      state,
      action: PayloadAction<{ outpostId: string; loading: boolean }>
    ) {
      const { outpostId, loading } = action.payload;
      if (!state.outpostPassSellers[outpostId]) {
        state.outpostPassSellers[outpostId] = {
          loading: true,
          sellers: [],
          error: undefined,
        };
      } else {
        state.outpostPassSellers[outpostId].loading = loading;
      }
    },
    setOutpostPassSellersError(
      state,
      action: PayloadAction<{ outpostId: string; error: string }>
    ) {
      const { outpostId, error } = action.payload;
      state.outpostPassSellers[outpostId].error = error;
    },
  },
});

export const {
  reducer: assetsReducer,
  name,
  actions: assetsActions,
} = assetsSlice;

export const useAssetsSlice = () => {
  injectContainer({
    name: name,
    reducer: assetsReducer,
    saga: assetsSaga, // Add saga if needed later
  });
};
