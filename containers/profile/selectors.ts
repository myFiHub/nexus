import { RootState } from "app/store";

export const myProfileDomains = {
  root: (state: RootState) => state,
  user: (state: RootState) => state.profile?.user,
  userError: (state: RootState) => state.profile?.userError,
  loading: (state: RootState) => state.profile?.loading,
};

export const myProfileSelectors = {
  user: myProfileDomains.user,
  userError: myProfileDomains.userError,
  loading: myProfileDomains.loading,
};
