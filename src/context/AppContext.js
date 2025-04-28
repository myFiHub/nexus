import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import PropTypes from 'prop-types';
import { WEB3AUTH_CONFIG, DEFAULTS } from '../config/config';
import podiumProtocol from '../services/podiumProtocol';

// Create context
const AppContext = createContext();

// Custom hook to use the app context
export const useApp = () => useContext(AppContext);

// Provider component
export function AppProvider({ children }) {
  // Wallet state
  const [walletState, setWalletState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPasses, setUserPasses] = useState([]);
  const [outposts, setOutposts] = useState([]);
  const [web3Auth, setWeb3Auth] = useState(null);

  // Initialize Web3Auth on mount
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3AuthInstance = new Web3Auth({
          clientId: WEB3AUTH_CONFIG.CLIENT_ID,
          chainConfig: WEB3AUTH_CONFIG.CHAIN_CONFIG
        });
        await web3AuthInstance.initModal();
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
        setError('Failed to initialize Web3Auth');
      }
    };

    initWeb3Auth();
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check Web3Auth connection
        if (web3Auth?.connected) {
          const userInfo = await web3Auth.getUserInfo();
          const provider = await web3Auth.connect();
          
          setWalletState({
            address: provider.getAddress(),
            type: 'web3auth',
            userInfo
          });
          setIsConnected(true);
          return;
        }

        // Check Nightly wallet connection
        if (window.movement) {
          try {
            const isConnected = await window.movement.isConnected();
            if (isConnected) {
              const address = await window.movement.account();
      setWalletState({
                address,
                type: 'nightly'
              });
              setIsConnected(true);
            }
          } catch (error) {
            console.error('Error checking Nightly wallet:', error);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setError('Failed to check wallet connection');
      }
    };
    
    checkWalletConnection();
  }, [web3Auth]);

  // Connect wallet
  const connectWallet = async (walletType = 'web3auth') => {
    try {
      setIsLoading(true);
      setError(null);

      if (walletType === 'web3auth') {
        if (!web3Auth) {
          throw new Error('Web3Auth not initialized');
        }

        const provider = await web3Auth.connect();
        const userInfo = await web3Auth.getUserInfo();

        setWalletState({
          address: provider.getAddress(),
          type: 'web3auth',
          userInfo
        });
        setIsConnected(true);
      } else if (walletType === 'nightly') {
        if (!window.movement) {
          throw new Error('Please install Nightly Wallet to use this feature');
        }

        await window.movement.connect();
        const address = await window.movement.account();

        setWalletState({
          address,
          type: 'nightly'
        });
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (walletState?.type === 'web3auth' && web3Auth) {
        await web3Auth.logout();
      } else if (walletState?.type === 'nightly' && window.movement) {
        await window.movement.disconnect();
      }

      setWalletState(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError('Failed to disconnect wallet');
    }
  };

  // Fetch user data when wallet is connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected) {
        try {
          setIsLoading(true);
          setError(null);
          
          // Fetch user passes
          const passes = await fetchUserPasses();
          setUserPasses(passes);
          
          // Fetch outposts
          const outpostsData = await fetchOutposts();
          setOutposts(outpostsData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear data when wallet is disconnected
        setUserPasses([]);
        setOutposts([]);
      }
    };

    fetchUserData();
  }, [isConnected]);

  // Fetch user passes
  const fetchUserPasses = async () => {
    if (!isConnected) return [];
    
    try {
      const account = walletState.address;
      const passes = [];
      
      // Fetch passes for each outpost
      for (const outpost of outposts) {
        const balance = await podiumProtocol.getPassBalance(account, outpost.address);
        const price = await podiumProtocol.getPassPrice(outpost.address);
        
        if (balance > 0) {
          passes.push({
            ...outpost,
            balance,
            currentPrice: price,
          });
        }
      }
      
      return passes;
    } catch (error) {
      console.error('Error fetching user passes:', error);
      throw error;
    }
  };

  // Fetch outposts
  const fetchOutposts = async () => {
    try {
      const outpostsData = await podiumProtocol.getOutposts();
      return outpostsData;
    } catch (error) {
      console.error('Error fetching outposts:', error);
      throw error;
    }
  };

  // Buy pass
  const buyPass = async (outpostAddress, amount, referrerAddress = DEFAULTS.REFERRER_ADDRESS) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const txnHash = await podiumProtocol.buyPass(
        walletState.address,
        outpostAddress,
        amount,
        referrerAddress,
        walletState.type === 'nightly' ? window.movement : null
      );
      
      // Refresh user passes
      const passes = await fetchUserPasses();
      setUserPasses(passes);
      
      return txnHash;
    } catch (error) {
      console.error('Error buying pass:', error);
      setError('Failed to buy pass');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sell pass
  const sellPass = async (outpostAddress, amount) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const txnHash = await podiumProtocol.sellPass(
        walletState.address,
        outpostAddress,
        amount,
        walletState.type === 'nightly' ? window.movement : null
      );
      
      // Refresh user passes
      const passes = await fetchUserPasses();
      setUserPasses(passes);
      
      return txnHash;
    } catch (error) {
      console.error('Error selling pass:', error);
      setError('Failed to sell pass');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    walletState,
    isConnected,
    isLoading,
    error,
    userPasses,
    outposts,
    connectWallet,
    disconnectWallet,
    buyPass,
    sellPass,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Add PropTypes validation
AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppContext; 