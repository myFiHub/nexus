import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import podiumProtocolService from '../../services/podiumProtocolService';
import { Outpost } from '../../types/outpost';

interface OutpostState {
  items: Outpost[];
  loading: boolean;
  error: string | null;
  selectedOutpost: Outpost | null;
}

const initialState: OutpostState = {
  items: [],
  loading: false,
  error: null,
  selectedOutpost: null,
};

// Async thunk for fetching outposts
export const fetchOutpostsAsync = createAsyncThunk<Outpost[], void, { rejectValue: string }>(
  'outposts/fetchOutpostsAsync',
  async (_, { rejectWithValue }) => {
    try {
      console.debug('[fetchOutpostsAsync] Fetching outposts...');
      const outposts = await podiumProtocolService.fetchOutposts();
      console.debug('[fetchOutpostsAsync] Success', outposts);
      return outposts;
    } catch (error: any) {
      console.error('[fetchOutpostsAsync] Error', error);
      return rejectWithValue(error?.message || 'Failed to fetch outposts');
    }
  }
);

const outpostSlice = createSlice({
  name: 'outposts',
  initialState,
  reducers: {
    selectOutpost(state, action: PayloadAction<Outpost | null>) {
      state.selectedOutpost = action.payload;
      console.debug('[outpostSlice] selectOutpost', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutpostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.debug('[outpostSlice] fetchOutpostsAsync.pending');
      })
      .addCase(fetchOutpostsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
        console.debug('[outpostSlice] fetchOutpostsAsync.fulfilled', action.payload);
      })
      .addCase(fetchOutpostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch outposts';
        console.error('[outpostSlice] fetchOutpostsAsync.rejected', action.payload);
      });
  },
});

export const { selectOutpost } = outpostSlice.actions;
export default outpostSlice.reducer; 