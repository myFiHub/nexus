import { useState, useEffect } from 'react';
import { AptosClient, AptosAccount, Types } from 'aptos';

// Define the account interface
export interface Account {
  address: string;
  publicKey: string;
}

// Define the wallet hook
export function useWallet() {
  const [account, setAccount] = useState<Account | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Connect to the wallet
  const connect = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Petra wallet is available
      if (!window.aptos) {
        throw new Error('Petra wallet not found. Please install it.');
      }

      // Request connection
      const response = await window.aptos.connect();
      
      if (response) {
        setAccount({
          address: response.address,
          publicKey: response.publicKey,
        });
        setConnected(true);
      }
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to wallet');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect from the wallet
  const disconnect = async () => {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
      }
      setAccount(null);
      setConnected(false);
    } catch (err) {
      console.error('Error disconnecting from wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect from wallet');
    }
  };

  // Sign and submit a transaction
  const signAndSubmitTransaction = async (payload: any) => {
    if (!connected || !window.aptos) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const response = await window.aptos.signAndSubmitTransaction(payload);
      return response;
    } catch (err) {
      console.error('Error signing transaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.aptos) {
        try {
          const isConnected = await window.aptos.isConnected();
          if (isConnected) {
            const account = await window.aptos.account();
            setAccount({
              address: account.address,
              publicKey: account.publicKey,
            });
            setConnected(true);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    account,
    connected,
    loading,
    error,
    connect,
    disconnect,
    signAndSubmitTransaction,
  };
}

// Add TypeScript declaration for the window.aptos object
declare global {
  interface Window {
    aptos: {
      connect: () => Promise<{ address: string; publicKey: string }>;
      disconnect: () => Promise<void>;
      isConnected: () => Promise<boolean>;
      account: () => Promise<{ address: string; publicKey: string }>;
      signAndSubmitTransaction: (payload: any) => Promise<any>;
    };
  }
} 