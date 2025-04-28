import { useCallback, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { WEB3AUTH_CONFIG } from '../config/config';
import { Web3AuthUser } from '../services/web3AuthService';
import { Web3AuthProvider } from '../constants/web3auth';

export interface Web3AuthHook {
  user: Web3AuthUser | null;
  isAuthenticated: boolean;
  error: Error | null;
  login: (provider: Web3AuthProvider) => Promise<void>;
  logout: () => Promise<void>;
}

export const useWeb3Auth = (): Web3AuthHook => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<Web3AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        if (!WEB3AUTH_CONFIG.CLIENT_ID) {
          throw new Error('Web3Auth client ID is not set');
        }

        const web3authInstance = new Web3Auth({
          clientId: WEB3AUTH_CONFIG.CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.chainId,
            rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.rpcTarget,
            displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.displayName,
            blockExplorer: WEB3AUTH_CONFIG.CHAIN_CONFIG.blockExplorer,
            ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.ticker,
            tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.tickerName,
          },
          web3AuthNetwork: 'mainnet',
        });

        await web3authInstance.initModal();
        setWeb3auth(web3authInstance);
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        setError(error instanceof Error ? error : new Error('Failed to initialize Web3Auth'));
      }
    };

    initWeb3Auth();
  }, []);

  const login = useCallback(async (provider: Web3AuthProvider) => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
    }

    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: provider,
      });
      setProvider(web3authProvider);
      const user = await web3auth.getUserInfo();
      setUserInfo(user as Web3AuthUser);
      setError(null);
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error instanceof Error ? error : new Error('Failed to login'));
      throw error;
    }
  }, [web3auth]);

  const logout = useCallback(async () => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setUserInfo(null);
      setError(null);
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error instanceof Error ? error : new Error('Failed to logout'));
      throw error;
    }
  }, [web3auth]);

  return {
    user: userInfo,
    isAuthenticated: !!provider,
    error,
    login,
    logout,
  };
}; 