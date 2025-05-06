import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { eth, move } from '../constants/chains';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Debug environment variables
console.log('[DEBUG] REACT_APP_WEB3_AUTH_CLIENT_ID:', process.env.REACT_APP_WEB3_AUTH_CLIENT_ID);
console.log('[DEBUG] REACT_APP_WEB3_AUTH_CLIENT_SECRET:', process.env.REACT_APP_WEB3_AUTH_CLIENT_SECRET);
console.log('[DEBUG] REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID:', process.env.REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID);
console.log('[DEBUG] REACT_APP_CHAIN_NAMESPACE:', process.env.REACT_APP_CHAIN_NAMESPACE);
console.log('[DEBUG] REACT_APP_RPC_TARGET:', process.env.REACT_APP_RPC_TARGET);
console.log('[DEBUG] REACT_APP_CHAIN_DISPLAY_NAME:', process.env.REACT_APP_CHAIN_DISPLAY_NAME);
console.log('[DEBUG] REACT_APP_BLOCK_EXPLORER:', process.env.REACT_APP_BLOCK_EXPLORER);
console.log('[DEBUG] REACT_APP_CHAIN_TICKER:', process.env.REACT_APP_CHAIN_TICKER);
console.log('[DEBUG] REACT_APP_CHAIN_TICKER_NAME:', process.env.REACT_APP_CHAIN_TICKER_NAME);
console.log('[DEBUG] REACT_APP_IS_TESTNET:', process.env.REACT_APP_IS_TESTNET);
console.log('[DEBUG] REACT_APP_PROJECT_ID:', process.env.REACT_APP_PROJECT_ID);
console.log('[DEBUG] REACT_APP_FIHUB_ADDRESS_APTOS:', process.env.REACT_APP_FIHUB_ADDRESS_APTOS);
console.log('[DEBUG] REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS:', process.env.REACT_APP_PODIUM_PROTOCOL_APTOS_ADDRESS);
console.log('[DEBUG] REACT_APP_CHEERBOO_APTOS_ADDRESS:', process.env.REACT_APP_CHEERBOO_APTOS_ADDRESS);

const wallets = [
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet,
      coinbaseWallet,
      walletConnectWallet,
    ]
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet,
    ]
  }
];

export const wagmiConfig = getDefaultConfig({
  appName: 'FiHub',
  projectId: process.env.REACT_APP_PROJECT_ID || '',
  chains: [eth, move],
  wallets,
});

export const queryClient = new QueryClient(); 