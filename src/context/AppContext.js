import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import podiumProtocol from '../services/podiumProtocol';
import { DEFAULTS, UI_CONFIG } from '../config/config';

// Create context
const AppContext = createContext();

// Custom hook to use the app context
export const useApp = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // State
  const [walletState, setWalletState] = useState({
    isConnected: false,
    address: null,
    walletType: null, // 'web3auth' or 'nightly'
  });
  const [userPasses, setUserPasses] = useState([]);
  const [outposts, setOutposts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth service
  useEffect(() => {
    const init = async () => {
      try {
        await authService.init();
        const isConnected = authService.isConnected();
        const address = isConnected ? authService.getAddress() : null;
        const walletType = isConnected ? authService.getWalletType() : null;
        
        setWalletState({
          isConnected,
          address,
          walletType,
        });
      } catch (error) {
        console.error('Error initializing auth service:', error);
        setError('Failed to initialize authentication service');
      }
    };

    init();
  }, []);

  // Set up wallet state change listener
  useEffect(() => {
    const handleWalletStateChange = (state) => {
      setWalletState({
        isConnected: state.isConnected,
        address: state.address,
        walletType: state.walletType,
      });
    };

    authService.addListener(handleWalletStateChange);

    return () => {
      authService.removeListener(handleWalletStateChange);
    };
  }, []);

  // Fetch user data when wallet is connected
  useEffect(() => {
    const fetchUserData = async () => {
      if (walletState.isConnected) {
        try {
          setLoading(true);
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
          setLoading(false);
        }
      } else {
        // Clear data when wallet is disconnected
        setUserPasses([]);
        setOutposts([]);
      }
    };

    fetchUserData();
  }, [walletState.isConnected]);

  // Connect with Web3Auth
  const connectWeb3Auth = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.connectWeb3Auth();
    } catch (error) {
      console.error('Error connecting with Web3Auth:', error);
      setError('Failed to connect with Web3Auth');
    } finally {
      setLoading(false);
    }
  };

  // Connect with Nightly wallet
  const connectNightlyWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.connectNightlyWallet();
    } catch (error) {
      console.error('Error connecting with Nightly wallet:', error);
      setError('Failed to connect with Nightly wallet');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError('Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user passes
  const fetchUserPasses = async () => {
    if (!walletState.isConnected) return [];
    
    try {
      const account = authService.getAccount();
      const passes = [];
      
      // Fetch passes for each outpost
      for (const outpost of outposts) {
        const balance = await podiumProtocol.getPassBalance(walletState.address, outpost.address);
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
      // This is a simplified version - in a real implementation, you would need to
      // fetch the outposts from the blockchain or an API
      return [
        {
          address: '0x123...',
          name: 'Example Outpost',
          description: 'This is an example outpost',
        },
      ];
    } catch (error) {
      console.error('Error fetching outposts:', error);
      throw error;
    }
  };

  // Buy pass
  const buyPass = async (outpostAddress, amount, referrerAddress = DEFAULTS.REFERRER_ADDRESS) => {
    if (!walletState.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const account = authService.getAccount();
      const txnHash = await podiumProtocol.buyPass(account, outpostAddress, amount, referrerAddress);
      
      // Refresh user passes
      const passes = await fetchUserPasses();
      setUserPasses(passes);
      
      return txnHash;
    } catch (error) {
      console.error('Error buying pass:', error);
      setError('Failed to buy pass');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sell pass
  const sellPass = async (outpostAddress, amount) => {
    if (!walletState.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const account = authService.getAccount();
      const txnHash = await podiumProtocol.sellPass(account, outpostAddress, amount);
      
      // Refresh user passes
      const passes = await fetchUserPasses();
      setUserPasses(passes);
      
      return txnHash;
    } catch (error) {
      console.error('Error selling pass:', error);
      setError('Failed to sell pass');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    walletState,
    userPasses,
    outposts,
    loading,
    error,
    connectWeb3Auth,
    connectNightlyWallet,
    disconnectWallet,
    buyPass,
    sellPass,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 