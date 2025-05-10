import { RootState } from './store';

export const selectWalletAddress = (state: RootState) => state.wallet.address;
export const selectWalletType = (state: RootState) => state.wallet.walletType;
export const selectWalletProvider = (state: RootState) => state.wallet.provider;
export const selectWalletIsConnecting = (state: RootState) => state.wallet.isConnecting;
export const selectWalletError = (state: RootState) => state.wallet.error;
export const selectWalletChainId = (state: RootState) => state.wallet.chainId;
export const selectWalletBalance = (state: RootState) => state.wallet.balance; 