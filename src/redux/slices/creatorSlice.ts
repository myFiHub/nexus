import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { AppDispatch } from '../store';
import { Creator } from '../../types/creator';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface CreatorState {
  items: Creator[];
  trending: Creator[];
  loading: boolean;
  error: string | null;
  selectedCreator: Creator | null;
}

const initialState: CreatorState = {
  items: [],
  trending: [],
  loading: false,
  error: null,
  selectedCreator: null,
};

// Async thunk for fetching creators (users)
export const fetchCreatorsAsync = createAsyncThunk<Creator[], void, { rejectValue: string }>(
  'creators/fetchCreatorsAsync',
  async (_, { rejectWithValue }) => {
    try {
      console.debug('[fetchCreatorsAsync] Fetching creators...');
      const creators = await userService.fetchCreators();
      console.debug('[fetchCreatorsAsync] Success', creators);
      return creators;
    } catch (error: any) {
      console.error('[fetchCreatorsAsync] Error', error);
      return rejectWithValue(error?.message || 'Failed to fetch creators');
    }
  }
);

const creatorSlice = createSlice({
  name: 'creators',
  initialState,
  reducers: {
    fetchCreatorsStart(state) {
      state.loading = true;
      state.error = null;
      console.debug('[creatorSlice] fetchCreatorsStart');
    },
    fetchCreatorsSuccess(state, action: PayloadAction<Creator[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      console.debug('[creatorSlice] fetchCreatorsSuccess', action.payload);
    },
    fetchCreatorsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      console.error('[creatorSlice] fetchCreatorsError', action.payload);
    },
    setTrending(state, action: PayloadAction<Creator[]>) {
      state.trending = action.payload;
      console.debug('[creatorSlice] setTrending', action.payload);
    },
    selectCreator(state, action: PayloadAction<Creator | null>) {
      state.selectedCreator = action.payload;
      console.debug('[creatorSlice] selectCreator', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.debug('[creatorSlice] fetchCreatorsAsync.pending');
      })
      .addCase(fetchCreatorsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
        console.debug('[creatorSlice] fetchCreatorsAsync.fulfilled', action.payload);
      })
      .addCase(fetchCreatorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch creators';
        console.error('[creatorSlice] fetchCreatorsAsync.rejected', action.payload);
      });
  },
});

export const {
  fetchCreatorsStart,
  fetchCreatorsSuccess,
  fetchCreatorsError,
  setTrending,
  selectCreator,
} = creatorSlice.actions;
export default creatorSlice.reducer; 