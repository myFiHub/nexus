import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const AssetsDomains = {
  root: (state: RootState) => state.assets,
  pass: (state: RootState) => state.assets?.passes || {},
  balance: (state: RootState) => state.assets?.balance || {},
  passesListBoughtByMe: (state: RootState) =>
    state.assets?.passesListBoughtByMe || {},
};

export const AssetsSelectors = {
  userPasses: (id: string) =>
    createSelector([AssetsDomains.pass], (passes) => passes[id] || undefined),

  userPassesLoading: (id: string) =>
    createSelector([AssetsDomains.pass], (passes) => {
      const pass = passes[id];
      return pass?.loading;
    }),
  balance: AssetsDomains.balance,
  passesListBoughtByMe: createSelector(
    [AssetsDomains.passesListBoughtByMe],
    (passesListBoughtByMe) => passesListBoughtByMe.passes
  ),
  passesListBoughtByMeLoading: createSelector(
    [AssetsDomains.passesListBoughtByMe],
    (passesListBoughtByMe) => passesListBoughtByMe.loading
  ),
  passesListBoughtByMeError: createSelector(
    [AssetsDomains.passesListBoughtByMe],
    (passesListBoughtByMe) => passesListBoughtByMe.error
  ),
};
