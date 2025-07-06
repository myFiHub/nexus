import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PAGE_SIZE } from "app/lib/constants";
import { OutpostModel } from "../../services/api/types";
import { injectContainer } from "../../store";
import { allOutpostsSaga } from "./saga";

export interface AllOutpostsState {
  outposts: OutpostModel[];
  loadingOutposts: boolean;
  loadingMoreOutposts: boolean;
  errorLoadingOutposts?: string;
  currentPage: number;
  hasMoreOutposts: boolean;
  pageSize: number;
}

const initialState: AllOutpostsState = {
  outposts: [],
  loadingOutposts: false,
  loadingMoreOutposts: false,
  errorLoadingOutposts: undefined,
  currentPage: 1,
  hasMoreOutposts: true,
  pageSize: PAGE_SIZE,
};

const allOutpostsSlice = createSlice({
  name: "allOutposts",
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
    getOutposts: (state) => {},
    loadMoreOutposts: (state) => {},
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
  },
});

export const {
  reducer: allOutpostsReducer,
  name,
  actions: allOutpostsActions,
} = allOutpostsSlice;

export const useAllOutpostsSlice = () => {
  injectContainer({
    name: name,
    reducer: allOutpostsReducer,
    saga: allOutpostsSaga,
  });
};
