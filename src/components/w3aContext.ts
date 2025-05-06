import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { AuthAdapter } from '@web3auth/auth-adapter';

let web3authInstance: Web3Auth | null = null;

export function getWeb3AuthInstance() {
  if (web3authInstance) return web3authInstance;

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: '126',
    rpcTarget: 'https://mainnet.movementnetwork.xyz/v1',
    displayName: 'Movement Mainnet',
    blockExplorerUrl: 'https://explorer.movementnetwork.xyz/?network=mainnet',
    ticker: 'MOVE',
    tickerName: 'Movement',
  };

  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3AuthOptions = {
    chainConfig,
    clientId: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID || '',
    web3AuthNetwork: 'mainnet' as 'mainnet',
    enableLogging: true,
    uiConfig: {
      theme: 'dark',
      loginMethodsOrder: ['google', 'facebook', 'twitter', 'discord'],
      primaryButton: 'socialLogin',
    },
    privateKeyProvider,
  };

  const web3auth = new Web3Auth(web3AuthOptions);
  const authAdapter = new AuthAdapter({ privateKeyProvider });
  web3auth.configureAdapter(authAdapter);

  web3authInstance = web3auth;
  return web3authInstance;
} 