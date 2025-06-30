import { RootState } from "../../store";

export const allOutpostsDomains = {
  root: (state: RootState) => state.allOutposts,
  outposts: (state: RootState) => state.allOutposts?.outposts ?? [],
  isLoadingOutposts: (state: RootState) =>
    state.allOutposts?.loadingOutposts ?? false,
  isLoadingMoreOutposts: (state: RootState) =>
    state.allOutposts?.loadingMoreOutposts ?? false,
  errorLoadingOutposts: (state: RootState) =>
    state.allOutposts?.errorLoadingOutposts ?? undefined,
  currentPage: (state: RootState) => state.allOutposts?.currentPage ?? 0,
  hasMoreOutposts: (state: RootState) =>
    state.allOutposts?.hasMoreOutposts ?? true,
  pageSize: (state: RootState) => state.allOutposts?.pageSize ?? 25,
};

export const allOutpostsSelectors = {
  outposts: allOutpostsDomains.outposts,
  isLoadingOutposts: allOutpostsDomains.isLoadingOutposts,
  isLoadingMoreOutposts: allOutpostsDomains.isLoadingMoreOutposts,
  errorLoadingOutposts: allOutpostsDomains.errorLoadingOutposts,
  currentPage: allOutpostsDomains.currentPage,
  hasMoreOutposts: allOutpostsDomains.hasMoreOutposts,
  pageSize: allOutpostsDomains.pageSize,
};
