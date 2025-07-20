import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "app/services/api/types";
import { injectContainer } from "app/store";
import { profileSaga } from "./saga";
import { NFTResponse } from "app/services/move/types";

export interface ProfileState {
  loading: boolean;
  user?: User;
  userError?: string;
  addressOfAccountThatIsBeingMadePrimary?: string;
  nfts: {
    loading: boolean;
    data: NFTResponse[];
    error: string;
  };
  settingNftAsProfilePicture?: string;
}

const initialState: ProfileState = {
  loading: false,
  nfts: {
    loading: false,
    data: [],
    error: "",
  },
  settingNftAsProfilePicture: undefined,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchNfts(state, action: PayloadAction<{ silent?: boolean }>) {},
    setNftsError(state, action: PayloadAction<string>) {
      state.nfts.error = action.payload;
      state.nfts.loading = false;
    },
    setNftsLoading(state, action: PayloadAction<boolean>) {
      state.nfts.loading = action.payload;
    },
    setNfts(state, action: PayloadAction<NFTResponse[]>) {
      state.nfts.data = action.payload;
      state.nfts.loading = false;
    },
    useNftAsProfilePicture(state, action: PayloadAction<NFTResponse>) {},
    settingNftAsProfilePicture(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.settingNftAsProfilePicture = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setUserError(state, action: PayloadAction<string>) {
      state.userError = action.payload;
    },
    makeAccountPrimary(_, __: PayloadAction<string>) {},
    setAddressOfAccountThatIsBeingMadePrimary(
      state,
      action: PayloadAction<string | undefined>
    ) {
      state.addressOfAccountThatIsBeingMadePrimary = action.payload;
    },
    deleteAccount(_, __: PayloadAction<void>) {},
  },
});

export const {
  reducer: profileReducer,
  name,
  actions: profileActions,
} = profileSlice;

export const useProfileSlice = () => {
  injectContainer({
    name: profileSlice.name,
    reducer: profileSlice.reducer,
    saga: profileSaga, // Add saga if needed later
  });
};
