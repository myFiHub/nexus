import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PodiumPassBuyerModel, User } from "app/services/api/types";
import { injectContainer } from "app/store";
import { assetsSaga } from "./saga";

export interface Balance {
  value: string;
  loading: boolean;
  error?: string;
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
      action: PayloadAction<{ user: User; numberOfTickets: number }>
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
