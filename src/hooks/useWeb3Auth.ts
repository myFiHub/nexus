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
  isInitializing: boolean;
}

export const useWeb3Auth = (): Web3AuthHook => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<Web3AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        if (!WEB3AUTH_CONFIG.CLIENT_ID) {
          throw new Error('Web3Auth client ID is not set. Please check your environment variables.');
        }

        console.log('Initializing Web3Auth with client ID:', WEB3AUTH_CONFIG.CLIENT_ID);

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
          enableLogging: true,
        });

        console.log('Web3Auth instance created, initializing modal...');
        await web3authInstance.initModal();
        console.log('Web3Auth modal initialized successfully');

        setWeb3auth(web3authInstance);
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        setError(error instanceof Error ? error : new Error('Failed to initialize Web3Auth'));
      } finally {
        setIsInitializing(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = useCallback(async (provider: Web3AuthProvider) => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
    }

    try {
      setError(null);
      console.log('Attempting to login with provider:', provider);
      
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: provider,
      });
      
      if (!web3authProvider) {
        throw new Error('Failed to connect to provider');
      }
      
      console.log('Successfully connected to provider');
      setProvider(web3authProvider);
      
      const user = await web3auth.getUserInfo();
      console.log('Retrieved user info:', user);
      
      // Get private key
      const privateKey = await web3authProvider.request({
        method: "private_key"
      }) as string;
      
      if (!privateKey) {
        throw new Error('No private key received from provider');
      }
      
      // Create user object with private key
      const userWithKey: Web3AuthUser = {
        privKey: privateKey,
        ed25519PrivKey: privateKey,
        userInfo: user as any,
      };
      
      setUserInfo(userWithKey);
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
      setError(null);
      console.log('Attempting to logout...');
      
      await web3auth.logout();
      console.log('Successfully logged out');
      
      setProvider(null);
      setUserInfo(null);
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
    isInitializing,
  };
}; 