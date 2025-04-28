import { CHAIN_NAMESPACES } from '@web3auth/base';

export const WEB3AUTH_CONFIG = {
  clientId: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID || '',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: process.env.INITIAL_EXTERNAL_WALLET_CHAIN_ID || '126', // Movement Network
    rpcTarget: 'https://mainnet.movementnetwork.xyz/v1',
    displayName: 'Movement Mainnet',
    blockExplorerUrl: 'https://explorer.movementnetwork.xyz/?network=mainnet',
    ticker: 'MOVE',
    tickerName: 'Movement',
  },
  web3AuthNetwork: 'mainnet',
} as const; 