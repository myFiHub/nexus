import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
}

const initialState: SessionState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: '',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = '';
      console.debug('[sessionSlice] setToken', action.payload);
    },
    clearToken(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = '';
      console.debug('[sessionSlice] clearToken');
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
      console.debug('[sessionSlice] setLoading', action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload || '';
      state.loading = false;
      console.error('[sessionSlice] setError', action.payload);
    },
  },
});

export const { setToken, clearToken, setLoading, setError } = sessionSlice.actions;
export default sessionSlice.reducer; 