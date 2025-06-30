import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { GlobalDomains } from "../global/selectors";

export const myProfileDomains = {
  root: (state: RootState) => state,
  addressOfAccountThatIsBeingMadePrimary: (state: RootState) =>
    state.profile.addressOfAccountThatIsBeingMadePrimary,
};

export const myProfileSelectors = {
  addressOfAccountThatIsBeingMadePrimary:
    myProfileDomains.addressOfAccountThatIsBeingMadePrimary,
  isAccountPrimary: (address: string) =>
    createSelector(
      GlobalDomains.podiumUserInfo,
      (podiumUserInfo) =>
        podiumUserInfo?.accounts.find((account) => account.address === address)
          ?.is_primary ?? false
    ),
};
