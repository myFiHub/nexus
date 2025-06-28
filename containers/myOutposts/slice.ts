import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { myOutpostsSaga } from "./saga";

export interface MyOutpostsState {
  outposts: OutpostModel[];
  loadingOutposts: boolean;
  errorLoadingOutposts?: string;

  // Empty state type as requested
}

const initialState: MyOutpostsState = {
  outposts: [],
  loadingOutposts: false,
  errorLoadingOutposts: undefined,
};

const usersSlice = createSlice({
  name: "myOutposts",
  initialState,
  reducers: {
    setLoadingOutposts: (state, action: PayloadAction<boolean>) => {
      state.loadingOutposts = action.payload;
    },
    setErrorLoadingOutposts: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.errorLoadingOutposts = action.payload;
    },
    getOutposts: (state) => {},
    setOutposts: (state, action: PayloadAction<OutpostModel[]>) => {
      state.outposts = action.payload;
    },
  },
});

export const {
  reducer: myOutpostsReducer,
  name,
  actions: myOutpostsActions,
} = usersSlice;

export const useMyOutpostsSlice = () => {
  injectContainer({
    name: name,
    reducer: myOutpostsReducer,
    saga: myOutpostsSaga,
  });
};
