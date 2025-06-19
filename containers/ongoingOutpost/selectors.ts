import { RootState } from "app/store";

export const onGoingOutpostDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.onGoingOutpost.outpost,
  isGettingOutpost: (state: RootState) => state.onGoingOutpost.isGettingOutpost,
};

export const onGoingOutpostSelectors = {
  outpost: onGoingOutpostDomains.outpost,
  isGettingOutpost: onGoingOutpostDomains.isGettingOutpost,
};
