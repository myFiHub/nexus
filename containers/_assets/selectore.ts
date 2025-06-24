import { createSelector } from "@reduxjs/toolkit";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
import { RootState } from "app/store";
import { OutpostAccesses } from "../global/effects/types";

// Create a stable reference for default accesses
const DEFAULT_ACCESSES: OutpostAccesses = {
  canEnter: false,
  canSpeak: false,
};

// Create stable references for common access combinations
const ACCESS_COMBINATIONS = {
  enterOnly: { canEnter: true, canSpeak: false },
  speakOnly: { canEnter: false, canSpeak: true },
  both: { canEnter: true, canSpeak: true },
} as const;

export const AssetsDomains = {
  root: (state: RootState) => state.assets,
  pass: (state: RootState) => state.assets?.passes || {},
  balance: (state: RootState) => state.assets?.balance || {},
  passesListBoughtByMe: (state: RootState) =>
    state.assets?.passesListBoughtByMe || {},
  outpostPassSellers: (state: RootState) =>
    state.assets?.outpostPassSellers || {},
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
  outpostPassSellers: (id?: string) =>
    createSelector([AssetsDomains.outpostPassSellers], (outpostPassSellers) => {
      if (!id) return undefined;
      return outpostPassSellers[id];
    }),
  outpostPassSellersLoading: (id?: string) =>
    createSelector([AssetsDomains.outpostPassSellers], (outpostPassSellers) => {
      if (!id) return true;
      return outpostPassSellers[id]?.loading;
    }),
  outpostPassSellersError: (id?: string) =>
    createSelector([AssetsDomains.outpostPassSellers], (outpostPassSellers) => {
      if (!id) return undefined;
      return outpostPassSellers[id]?.error;
    }),

  accesses: (outpostId: string) => (state: RootState) => {
    if (!outpostId) return DEFAULT_ACCESSES;
    const sellers =
      state.assets?.outpostPassSellers?.[outpostId]?.sellers || [];

    if (!sellers.length) return DEFAULT_ACCESSES;

    const canEnter = sellers.some(
      (seller) =>
        seller.bought &&
        (seller.accessIfIBuy === "enter" ||
          seller.accessIfIBuy === "enterAndSpeak")
    );
    const canSpeak = sellers.some(
      (seller) =>
        seller.bought &&
        (seller.accessIfIBuy === "speak" ||
          seller.accessIfIBuy === "enterAndSpeak")
    );

    // Return stable references to prevent creating new objects
    if (!canEnter && !canSpeak) return DEFAULT_ACCESSES;
    if (canEnter && canSpeak) return ACCESS_COMBINATIONS.both;
    if (canEnter && !canSpeak) return ACCESS_COMBINATIONS.enterOnly;
    if (!canEnter && canSpeak) return ACCESS_COMBINATIONS.speakOnly;

    // Fallback (should never reach here)
    return DEFAULT_ACCESSES;
  },
};
