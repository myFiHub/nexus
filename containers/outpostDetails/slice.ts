import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { outpostDetailsSaga } from "./saga";

export interface OutpostDetailsState {
  outpost?: OutpostModel;
  editingScheduledDate: boolean;
}

const initialState: OutpostDetailsState = {
  editingScheduledDate: false,
};

const globalSlice = createSlice({
  name: "outpostDetails",
  initialState,
  reducers: {
    getOutpost(_, __: PayloadAction<string>) {},
    setOutpost(state, action: PayloadAction<OutpostModel | undefined>) {
      state.outpost = action.payload;
    },
    editScheduledDate(_, __: PayloadAction<{ outpost: OutpostModel }>) {},
    setEditingScheduledDate(state, action: PayloadAction<boolean>) {
      state.editingScheduledDate = action.payload;
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
