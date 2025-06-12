import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { injectContainer } from "app/store";

export interface Balance {
  value: string;
  loading: boolean;
  error?: string;
}

export interface AssetsState {
  balance: Balance;
}

const initialState: AssetsState = {
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
    saga: null, // Add saga if needed later
  });
};
