import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { injectContainer } from "app/store";
import { assetsSaga } from "./saga";

export interface Balance {
  value: string;
  loading: boolean;
  error?: string;
}

export interface Pass {
  gettingPrice: boolean;
  price: string;
  gettingOwnedNumber: boolean;
  ownedNumber: number;
  error?: string;
  errorGettingPrice?: string;
  errorGettingOwnedNumber?: string;
}
export interface AssetsState {
  balance: Balance;
  passes: {
    [key: string]: Pass;
  };
}

const initialState: AssetsState = {
  passes: {},
  balance: {
    value: "",
    loading: false,
    error: undefined,
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
    setUserPassInfo(
      state,
      action: PayloadAction<{ address: string; pass: Pass }>
    ) {
      const { address, pass } = action.payload;
      state.passes[address] = pass;
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
