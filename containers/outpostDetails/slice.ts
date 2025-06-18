import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { outpostDetailsSaga } from "./saga";

export interface OutpostDetailsState {
  outpost?: OutpostModel;
}

const initialState: OutpostDetailsState = {};

const globalSlice = createSlice({
  name: "outpostDetails",
  initialState,
  reducers: {
    setOutpost(state, action: PayloadAction<OutpostModel>) {
      state.outpost = action.payload;
    },
  },
});

export const {
  reducer: outpostDetailsReducer,
  name,
  actions: outpostDetailsActions,
} = globalSlice;

export const useOutpostDetailsSlice = () => {
  injectContainer({
    name: name,
    reducer: outpostDetailsReducer,
    saga: outpostDetailsSaga,
  });
};
