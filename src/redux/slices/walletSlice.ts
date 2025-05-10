import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../types/wallet';

// Initial wallet state
const initialState: Wallet = {
  address: null,
  chainId: 0,
  balance: '0',
  isConnecting: false,
  error: null,
  walletType: null,
  provider: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    startConnecting(state) {
      state.isConnecting = true;
      state.error = null;
      console.debug('[walletSlice] startConnecting');
    },
    setWallet(state, action: PayloadAction<{ address: string; chainId: number; balance: string; walletType: string; provider?: any }>) {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
      state.walletType = action.payload.walletType;
      state.provider = action.payload.provider || null;
      state.isConnecting = false;
      state.error = null;
      console.debug('[walletSlice] setWallet', action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isConnecting = false;
      console.error('[walletSlice] setError', action.payload);
    },
    disconnect(state) {
      state.address = null;
      state.chainId = 0;
      state.balance = '0';
      state.isConnecting = false;
      state.error = null;
      state.walletType = null;
      state.provider = null;
      console.debug('[walletSlice] disconnect');
    },
  },
});

export const { startConnecting, setWallet, setError, disconnect } = walletSlice.actions;
export default walletSlice.reducer; 