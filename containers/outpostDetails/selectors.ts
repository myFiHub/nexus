import { RootState } from "app/store";

export const outpostDetailsDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.outpostDetails.outpost,
};

export const outpostDetailsSelectors = {
  outpost: outpostDetailsDomains.outpost,
};
