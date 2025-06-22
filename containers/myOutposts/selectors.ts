import { RootState } from "app/store";

export const myOutpostsDomains = {
  root: (state: RootState) => state.myOutposts,
  outposts: (state: RootState) => state.myOutposts?.outposts ?? [],
  isLoadingOutposts: (state: RootState) =>
    state.myOutposts?.loadingOutposts ?? false,
  errorLoadingOutposts: (state: RootState) =>
    state.myOutposts?.errorLoadingOutposts ?? undefined,
};

export const myOutpostsSelectors = {
  outposts: myOutpostsDomains.outposts,
  isLoadingOutposts: myOutpostsDomains.isLoadingOutposts,
  errorLoadingOutposts: myOutpostsDomains.errorLoadingOutposts,
};
