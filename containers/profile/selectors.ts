import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const myProfileDomains = {
  root: (state: RootState) => state,
  addressOfAccountThatIsBeingMadePrimary: (state: RootState) =>
    state.profile?.addressOfAccountThatIsBeingMadePrimary,
  podiumUserInfo: (state: RootState) => state.global?.podiumUserInfo,
  nfts: (state: RootState) => state.profile?.nfts,
  settingNftAsProfilePicture: (state: RootState) =>
    state.profile?.settingNftAsProfilePicture,
};

export const myProfileSelectors = {
  addressOfAccountThatIsBeingMadePrimary:
    myProfileDomains.addressOfAccountThatIsBeingMadePrimary,
  isAccountPrimary: (address: string) =>
    createSelector(myProfileDomains.podiumUserInfo, (podiumUserInfo) => {
      if (!podiumUserInfo) return false;
      const connectedAccounts = podiumUserInfo.accounts;
      if (connectedAccounts.length === 0) return true;
      return (
        connectedAccounts.find((account) => account.address === address)
          ?.is_primary ?? false
      );
    }),
  nfts: myProfileDomains.nfts,
  settingNftAsProfilePicture: myProfileDomains.settingNftAsProfilePicture,
};
