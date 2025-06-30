import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "app/services/api/types";
import { injectContainer } from "app/store";
import { profileSaga } from "./saga";

export interface ProfileState {
  loading: boolean;
  user?: User;
  userError?: string;
  addressOfAccountThatIsBeingMadePrimary?: string;
}

const initialState: ProfileState = {
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfile() {},
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
  },
});

export const {
  reducer: profileReducer,
  name,
  actions: profileActions,
} = profileSlice;

export const useProfileSlice = () => {
  injectContainer({
    name: name,
    reducer: profileReducer,
    saga: profileSaga, // Add saga if needed later
  });
};
