import { RootState } from "app/store";

export const myOutpostsDomains = {
  root: (state: RootState) => state.myOutposts,
  outposts: (state: RootState) => state.myOutposts?.outposts ?? [],
  isLoadingOutposts: (state: RootState) =>
    state.myOutposts?.loadingOutposts ?? false,
  isLoadingMoreOutposts: (state: RootState) =>
    state.myOutposts?.loadingMoreOutposts ?? false,
  errorLoadingOutposts: (state: RootState) =>
    state.myOutposts?.errorLoadingOutposts ?? undefined,
  currentPage: (state: RootState) => state.myOutposts?.currentPage ?? 0,
  hasMoreOutposts: (state: RootState) =>
    state.myOutposts?.hasMoreOutposts ?? true,
  pageSize: (state: RootState) => state.myOutposts?.pageSize ?? 25,
};

export const myOutpostsSelectors = {
  outposts: myOutpostsDomains.outposts,
  isLoadingOutposts: myOutpostsDomains.isLoadingOutposts,
  isLoadingMoreOutposts: myOutpostsDomains.isLoadingMoreOutposts,
  errorLoadingOutposts: myOutpostsDomains.errorLoadingOutposts,
  currentPage: myOutpostsDomains.currentPage,
  hasMoreOutposts: myOutpostsDomains.hasMoreOutposts,
  pageSize: myOutpostsDomains.pageSize,
};
