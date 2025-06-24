import { RootState } from "app/store";
import { initialState } from "./slice";

export const onGoingOutpostDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.onGoingOutpost.outpost,
  isGettingOutpost: (state: RootState) => state.onGoingOutpost.isGettingOutpost,
  accesses: (state: RootState) =>
    state.onGoingOutpost?.accesses || initialState.accesses,
};

export const onGoingOutpostSelectors = {
  outpost: onGoingOutpostDomains.outpost,
  isGettingOutpost: onGoingOutpostDomains.isGettingOutpost,
  accesses: onGoingOutpostDomains.accesses,
};
