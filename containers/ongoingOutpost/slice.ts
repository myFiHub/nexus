import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { onGoingOutpostSaga } from "./saga";
import { OutpostAccesses } from "../global/effects/types";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
  accesses: OutpostAccesses;
  isGettingOutpost: boolean;
}

export const initialState: OnGoingOutpostState = {
  isGettingOutpost: false,
  accesses: { canEnter: false, canSpeak: false },
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
    setAccesses(state, actions: PayloadAction<OutpostAccesses>) {
      state.accesses = actions.payload;
    },
    setOutpostAccesses(state, actions: PayloadAction<OutpostAccesses>) {
      state.accesses = actions.payload;
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
