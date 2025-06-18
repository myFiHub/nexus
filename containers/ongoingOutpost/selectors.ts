import { RootState } from "app/store";

export const onGoingOutpostDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.outpostDetails.outpost,
};

export const onGoingOutpostSelectors = {
  outpost: onGoingOutpostDomains.outpost,
};
