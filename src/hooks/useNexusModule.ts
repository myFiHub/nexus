import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { useAptosClient } from './useAptosClient';
import podiumProtocol from '../services/podiumProtocol';

export interface UserProfile {
  name: string;
  description: string;
  uri: string;
  creator: string;
  totalSupply: number;
  subscriptionTiers: {
    name: string;
    price: number;
    duration: number;
  }[];
}

export const useNexusModule = () => {
  const { account, connected } = useWallet();
  const { client, loading: clientLoading, error: clientError } = useAptosClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!connected || !account?.address || !client) return;

      try {
        setLoading(true);
        setError(null);

        const outpostData = await podiumProtocol.getOutpost(account.address);
        setProfile(outpostData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [connected, account?.address, client]);

  const createProfile = async (name: string, description: string, uri: string) => {
    if (!connected || !account?.address || !client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const txHash = await podiumProtocol.createOutpost(
        account.address,
        name,
        description,
        uri
      );

      // Refresh profile after creation
      const outpostData = await podiumProtocol.getOutpost(account.address);
      setProfile(outpostData);

      return txHash;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name: string, description: string, uri: string) => {
    if (!connected || !account?.address || !client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Note: Update functionality would need to be implemented in the Podium Protocol
      // This is a placeholder for the actual implementation
      const txHash = await podiumProtocol.createOutpost(
        account.address,
        name,
        description,
        uri
      );

      // Refresh profile after update
      const outpostData = await podiumProtocol.getOutpost(account.address);
      setProfile(outpostData);

      return txHash;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading: loading || clientLoading,
    error: error || clientError,
    createProfile,
    updateProfile
  };
}; 