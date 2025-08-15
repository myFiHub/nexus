import { createSelector } from "@reduxjs/toolkit";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
import { BlockchainPassData } from "app/services/move/types";
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
  sellingPass: (state: RootState) => state.assets?.sellingPass,
  buyingPass: (state: RootState) => state.assets?.buyingPass,
  myBlockchainPasses: (state: RootState) =>
    state.assets?.myBlockchainPasses || {},
};

export const AssetsSelectors = {
  userPasses: (id: string) => (state: RootState) => {
    const passes = state.assets?.passes || {};
    const pass = passes[id];
    if (pass === undefined) {
      return undefined;
    } else {
      const tmp = { ...pass };
      const ownedInCoin = tmp.ownedNumber || 0;
      tmp.ownedNumber = bigIntCoinToMoveOnAptos(ownedInCoin);
      return tmp;
    }
  },

  userPassesLoading: (id: string) => (state: RootState) => {
    const pass = state.assets?.passes?.[id];
    return pass?.loading ?? false;
  },
  balance: createSelector(
    [AssetsDomains.balance, (state: RootState) => state.global?.podiumUserInfo],
    (balance, myUser) => {
      if (!myUser)
        return {
          value: "0",
          loading: false,
          error: undefined,
        };
      const tmp = { ...balance };
      const valueStr = balance.value.toString();
      tmp.value = valueStr.includes(".") ? valueStr : `${valueStr ?? "0"}.0`;
      return tmp;
    }
  ),
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
  sellingPass: AssetsDomains.sellingPass,
  buyingPass: AssetsDomains.buyingPass,
  myBlockchainPasses: AssetsDomains.myBlockchainPasses,
  myBlockchainPassesLoading: (state: RootState) =>
    state.assets?.myBlockchainPasses?.loading || false,
  myBlockchainPassesError: (state: RootState) =>
    state.assets?.myBlockchainPasses?.error || undefined,
  myBlockchainPassesPasses: createSelector(
    [AssetsDomains.myBlockchainPasses, AssetsDomains.passesListBoughtByMe],
    (myBlockchainPasses, passesListBoughtByMe) => {
      const blockchainPasses = myBlockchainPasses.passes;
      const passesBoughtByMe = passesListBoughtByMe.passes;
      const uniqueList: BlockchainPassData[] = [];

      blockchainPasses.forEach((pass) => {
        uniqueList.push(pass);
      });
      passesBoughtByMe.forEach((pass) => {
        const last6Charachters = pass.podium_pass_owner_address
          .slice(-6)
          .toUpperCase();
        const symbol = `P${last6Charachters}`;
        const index = uniqueList.findIndex((p) => p.passSymbol === symbol);
        if (index === -1) {
          uniqueList.push({
            amountOwned: pass.count,
            passSymbol: symbol,
            userAptosAddress: pass.podium_pass_owner_address,
            userUuid: pass.podium_pass_owner_address,
            userImage: pass.image,
            userName: pass.name,
            followedByMe: pass.followed_by_me,
          });
        }
      });
      const sortedResults = uniqueList.sort((a, b) => {
        if (a.userUuid && b.userUuid) {
          return 0;
        }
        return a.userUuid ? -1 : 1;
      });
      return sortedResults;
    }
  ),
};
