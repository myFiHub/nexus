import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { onGoingOutpostSaga } from "./saga";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
  isGettingOutpost: boolean;
}

const initialState: OnGoingOutpostState = {
  isGettingOutpost: false,
};

const onGoingOutpostSlice = createSlice({
  name: "onGoingOutpost",
  initialState,
  reducers: {
    getOutpost(state, action: PayloadAction<{ id: string }>) {
      console.log("Getting outpost!!!!!!!!!!!!!!!!");
    },
    isGettingOutpost(state, action: PayloadAction<boolean>) {
      state.isGettingOutpost = action.payload;
    },
    setOutpost(state, action: PayloadAction<OutpostModel>) {
      state.outpost = action.payload;
    },
  },
});

export const {
  reducer: onGoingOutpostReducer,
  name,
  actions: onGoingOutpostActions,
} = onGoingOutpostSlice;

export const useOnGoingOutpostSlice = () => {
  injectContainer({
    name: name,
    reducer: onGoingOutpostReducer,
    saga: onGoingOutpostSaga,
  });
};
