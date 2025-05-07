import { QueryClient } from '@tanstack/react-query';
import { eth, move } from '../constants/chains';

// Debug environment variables
console.log('[DEBUG] VITE_WEB3_AUTH_CLIENT_ID:', import.meta.env.VITE_WEB3_AUTH_CLIENT_ID);
console.log('[DEBUG] VITE_WEB3_AUTH_CLIENT_SECRET:', import.meta.env.VITE_WEB3_AUTH_CLIENT_SECRET);
console.log('[DEBUG] VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID:', import.meta.env.VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID);
console.log('[DEBUG] VITE_CHAIN_NAMESPACE:', import.meta.env.VITE_CHAIN_NAMESPACE);
console.log('[DEBUG] VITE_RPC_TARGET:', import.meta.env.VITE_RPC_TARGET);
console.log('[DEBUG] VITE_CHAIN_DISPLAY_NAME:', import.meta.env.VITE_CHAIN_DISPLAY_NAME);
console.log('[DEBUG] VITE_BLOCK_EXPLORER:', import.meta.env.VITE_BLOCK_EXPLORER);
console.log('[DEBUG] VITE_CHAIN_TICKER:', import.meta.env.VITE_CHAIN_TICKER);
console.log('[DEBUG] VITE_CHAIN_TICKER_NAME:', import.meta.env.VITE_CHAIN_TICKER_NAME);
console.log('[DEBUG] VITE_IS_TESTNET:', import.meta.env.VITE_IS_TESTNET);
console.log('[DEBUG] VITE_PROJECT_ID:', import.meta.env.VITE_PROJECT_ID);
console.log('[DEBUG] VITE_FIHUB_ADDRESS_APTOS:', import.meta.env.VITE_FIHUB_ADDRESS_APTOS);
console.log('[DEBUG] VITE_PODIUM_PROTOCOL_APTOS_ADDRESS:', import.meta.env.VITE_PODIUM_PROTOCOL_APTOS_ADDRESS);
console.log('[DEBUG] VITE_CHEERBOO_APTOS_ADDRESS:', import.meta.env.VITE_CHEERBOO_APTOS_ADDRESS);

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
