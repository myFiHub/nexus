import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const AssetsDomains = {
  root: (state: RootState) => state.assets,
  pass: (state: RootState) => state.assets?.passes || {},
};

export const AssetsSelectors = {
  userPasses: (id: string) =>
    createSelector([AssetsDomains.pass], (passes) => passes[id] || undefined),
  userPassesLoading: (id: string) =>
    createSelector([AssetsDomains.pass], (passes) => {
      const pass = passes[id];
      return pass?.loading;
    }),
};
