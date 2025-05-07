import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPortfolioItem } from '../../types/user';

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
      state.error = null;
      console.debug('[userSlice] fetchUserStart');
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
      console.debug('[userSlice] fetchUserSuccess', action.payload);
    },
    fetchUserError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      console.error('[userSlice] fetchUserError', action.payload);
    },
    updatePortfolio(state, action: PayloadAction<UserPortfolioItem[]>) {
      if (state.profile) {
        state.profile.portfolio = action.payload;
        console.debug('[userSlice] updatePortfolio', action.payload);
      }
    },
    followOutpost(state, action: PayloadAction<string>) {
      if (state.profile && !state.profile.followedOutposts.includes(action.payload)) {
        state.profile.followedOutposts.push(action.payload);
        console.debug('[userSlice] followOutpost', action.payload);
      }
    },
    followCreator(state, action: PayloadAction<string>) {
      if (state.profile && !state.profile.followedCreators.includes(action.payload)) {
        state.profile.followedCreators.push(action.payload);
        console.debug('[userSlice] followCreator', action.payload);
      }
    },
  },
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserError,
  updatePortfolio,
  followOutpost,
  followCreator,
} = userSlice.actions;
export default userSlice.reducer; 