import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGE_SIZE } from "app/lib/constants";
import { OutpostModel } from "app/services/api/types";
import { injectContainer } from "app/store";
import { myOutpostsSaga } from "./saga";

export interface MyOutpostsState {
  outposts: OutpostModel[];
  loadingOutposts: boolean;
  loadingMoreOutposts: boolean;
  errorLoadingOutposts?: string;
  currentPage: number;
  hasMoreOutposts: boolean;
  pageSize: number;
}

const initialState: MyOutpostsState = {
  outposts: [],
  loadingOutposts: false,
  loadingMoreOutposts: false,
  errorLoadingOutposts: undefined,
  currentPage: 0,
  hasMoreOutposts: true,
  pageSize: PAGE_SIZE,
};

const myOutpostsSlice = createSlice({
  name: "myOutposts",
  initialState,
  reducers: {
    setLoadingOutposts: (state, action: PayloadAction<boolean>) => {
      state.loadingOutposts = action.payload;
    },
    setLoadingMoreOutposts: (state, action: PayloadAction<boolean>) => {
      state.loadingMoreOutposts = action.payload;
    },
    setErrorLoadingOutposts: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.errorLoadingOutposts = action.payload;
    },
    setHasMoreOutposts: (state, action: PayloadAction<boolean>) => {
      state.hasMoreOutposts = action.payload;
    },
    getOutposts: (_, __: PayloadAction<void>) => {},

    loadMoreOutposts: (_, __: PayloadAction<void>) => {},
    setOutposts: (state, action: PayloadAction<OutpostModel[]>) => {
      state.outposts = action.payload;
      state.currentPage = 0;
      state.hasMoreOutposts = action.payload.length === state.pageSize;
    },
    appendOutposts: (state, action: PayloadAction<OutpostModel[]>) => {
      state.outposts.push(...action.payload);
      state.currentPage += 1;
      state.hasMoreOutposts = action.payload.length === state.pageSize;
    },
    resetOutposts: (state) => {
      state.outposts = [];
      state.currentPage = 0;
      state.hasMoreOutposts = true;
      state.errorLoadingOutposts = undefined;
    },
    removeOutpost: (state, action: PayloadAction<string>) => {
      state.outposts = state.outposts.filter(
        (outpost) => outpost.uuid !== action.payload
      );
    },
  },
});

export const {
  reducer: myOutpostsReducer,
  name,
  actions: myOutpostsActions,
} = myOutpostsSlice;

export const useMyOutpostsSlice = () => {
  injectContainer({
    name: name,
    reducer: myOutpostsReducer,
    saga: myOutpostsSaga,
  });
};
