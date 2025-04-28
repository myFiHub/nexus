import { useEffect, useState } from 'react';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { WEB3AUTH_CONFIG } from '../constants/web3authConfig';

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3AuthNoModal({
          clientId: WEB3AUTH_CONFIG.clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            chainId: WEB3AUTH_CONFIG.chainConfig.chainId,
            rpcTarget: WEB3AUTH_CONFIG.chainConfig.rpcTarget,
            displayName: WEB3AUTH_CONFIG.chainConfig.displayName,
            blockExplorerUrl: WEB3AUTH_CONFIG.chainConfig.blockExplorerUrl,
            ticker: WEB3AUTH_CONFIG.chainConfig.ticker,
            tickerName: WEB3AUTH_CONFIG.chainConfig.tickerName,
          },
          web3AuthNetwork: WEB3AUTH_CONFIG.web3AuthNetwork,
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected) {
          const provider = await web3authInstance.provider;
          const userInfo = await web3authInstance.getUserInfo();
          setProvider(provider);
          setUserInfo(userInfo);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        setError('Failed to initialize Web3Auth');
      }
    };

    init();
  }, []);

  const login = async (loginProvider: string) => {
    try {
      if (!web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider,
      });

      if (!web3authProvider) {
        throw new Error('Failed to connect to provider');
      }

      const userInfo = await web3auth.getUserInfo();
      setProvider(web3authProvider);
      setUserInfo(userInfo);
      setIsConnected(true);
      setError(null);
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to log in');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      await web3auth.logout();
      setProvider(null);
      setUserInfo(null);
      setIsConnected(false);
      setError(null);
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out');
      throw error;
    }
  };

  const getUserInfo = async () => {
    try {
      if (!web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      const userInfo = await web3auth.getUserInfo();
      setUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      console.error('Error getting user info:', error);
      setError('Failed to get user info');
      throw error;
    }
  };

  return {
    web3auth,
    provider,
    isConnected,
    userInfo,
    error,
    login,
    logout,
    getUserInfo,
  };
}; 