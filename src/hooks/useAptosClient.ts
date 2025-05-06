import { useState, useEffect } from 'react';
import { AptosClient } from 'aptos';

export const useAptosClient = () => {
  const [client, setClient] = useState<AptosClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Movement Mainnet configuration
      const nodeUrl = 'https://mainnet.movement.network/v1';
      const aptosClient = new AptosClient(nodeUrl);
      setClient(aptosClient);
    } catch (err) {
      console.error('Error initializing Aptos client:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Aptos client');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    client,
    loading,
    error
  };
}; 