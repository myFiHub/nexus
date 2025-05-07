import { CHAIN_NAMESPACES } from '@web3auth/base';

// Environment variable validation
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    console.warn(`Warning: Environment variable ${name} is not set`);
    return '';
  }
  return value;
};

export const WEB3AUTH_CONFIG = {
  clientId: validateEnvVar('VITE_WEB3_AUTH_CLIENT_ID', import.meta.env.VITE_WEB3_AUTH_CLIENT_ID),
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: import.meta.env.VITE_INITIAL_EXTERNAL_WALLET_CHAIN_ID || '126', // Movement Network
    rpcTarget: 'https://mainnet.movementnetwork.xyz/v1',
    displayName: 'Movement Mainnet',
    blockExplorerUrl: 'https://explorer.movementnetwork.xyz/?network=mainnet',
    ticker: 'MOVE',
    tickerName: 'Movement',
  },
  web3AuthNetwork: 'mainnet',
} as const; 