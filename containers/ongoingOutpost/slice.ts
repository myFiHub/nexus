import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { onGoingOutpostSaga } from "./saga";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
}

const initialState: OnGoingOutpostState = {};

const globalSlice = createSlice({
  name: "onGoingOutpost",
  initialState,
  reducers: {
    setOutpost(state, action: PayloadAction<OutpostModel>) {
      state.outpost = action.payload;
    },
  },
});

export const {
  reducer: onGoingOutpostReducer,
  name,
  actions: onGoingOutpostActions,
} = globalSlice;

export const useOnGoingOutpostSlice = () => {
  injectContainer({
    name: name,
    reducer: onGoingOutpostReducer,
    saga: onGoingOutpostSaga,
  });
};
