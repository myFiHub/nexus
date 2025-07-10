import { createSlice } from "@reduxjs/toolkit";

const dummySlice = createSlice({
  name: "dummy",
  initialState: {},
  reducers: {
    dummy: (state) => {},
  },
});

export const {
  reducer: dummyReducer,
  name,
  actions: dummyActions,
} = dummySlice;
