import { createSelector } from "@reduxjs/toolkit";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
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
    createSelector([AssetsDomains.pass], (passes) => {
      const pass = passes[id];
      if (pass === undefined) {
        return undefined;
      } else {
        const tmp = { ...pass };
        const ownedInCoin = tmp.ownedNumber || 0;
        tmp.ownedNumber = bigIntCoinToMoveOnAptos(ownedInCoin);
        return tmp;
      }
    }),

  userPassesLoading: (id: string) =>
    createSelector([AssetsDomains.pass], (passes) => {
      const pass = passes[id];
      return pass?.loading;
    }),
  balance: createSelector([AssetsDomains.balance], (balance) => {
    const tmp = { ...balance };
    const balanceValueInMove = bigIntCoinToMoveOnAptos(balance.value);
    const valueStr = balanceValueInMove.toString();
    tmp.value = valueStr.includes(".") ? valueStr : `${valueStr}.0`;
    return tmp;
  }),
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
