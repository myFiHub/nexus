import React, { useState, useEffect } from 'react';
import podiumProtocol, { OutpostData, Subscription, SubscriptionTier } from '../services/podiumProtocol';
import { useWallet } from '../hooks/useWallet';

const NexusProfile: React.FC = () => {
  const { account, connected, connect, disconnect, loading: walletLoading } = useWallet();
  const [outpost, setOutpost] = useState<OutpostData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passBalance, setPassBalance] = useState<number>(0);
  const [passPrice, setPassPrice] = useState<number>(0);
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [passAmount, setPassAmount] = useState<number>(1);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [outpostName, setOutpostName] = useState<string>('');
  const [outpostDescription, setOutpostDescription] = useState<string>('');
  const [outpostUri, setOutpostUri] = useState<string>('');

  // Fetch outpost data when target address changes
  useEffect(() => {
    if (targetAddress) {
      fetchOutpostData(targetAddress);
    }
  }, [targetAddress]);

  const fetchOutpostData = async (address: string) => {
    if (!address) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get outpost data
      const outpostData = await podiumProtocol.getOutpost(address);
      setOutpost(outpostData);
      
      // Get pass balance for the connected wallet
      if (account?.address) {
        const balance = await podiumProtocol.getPassBalance(account.address, address);
        setPassBalance(balance);
        
        // Get pass price
        const price = await podiumProtocol.getPassPrice(address);
        setPassPrice(price);

        // Get subscription data
        const sub = await podiumProtocol.getSubscription(account.address, address);
        setSubscription(sub);

        // Get subscription tiers
        const tiers = outpostData.subscriptionTiers || [];
        setSubscriptionTiers(tiers);
      }
      
    } catch (err) {
      console.error('Error fetching outpost data:', err);
      setError('Failed to fetch outpost data');
      setOutpost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAddress.trim()) {
      fetchOutpostData(targetAddress);
    }
  };

  const handleBuyPass = async () => {
    if (!account?.address || !targetAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const txHash = await podiumProtocol.buyPass(account.address, targetAddress, passAmount);
      console.log('Transaction submitted:', txHash);
      
      // Refresh data after transaction
      await fetchOutpostData(targetAddress);
      
    } catch (err) {
      console.error('Error buying pass:', err);
      setError('Failed to buy pass');
    } finally {
      setLoading(false);
    }
  };

  const handleSellPass = async () => {
    if (!account?.address || !targetAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const txHash = await podiumProtocol.sellPass(account.address, targetAddress, passAmount);
      console.log('Transaction submitted:', txHash);
      
      // Refresh data after transaction
      await fetchOutpostData(targetAddress);
      
    } catch (err) {
      console.error('Error selling pass:', err);
      setError('Failed to sell pass');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!account?.address || !targetAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const txHash = await podiumProtocol.subscribe(account.address, targetAddress, selectedTier);
      console.log('Transaction submitted:', txHash);
      
      // Refresh data after transaction
      await fetchOutpostData(targetAddress);
      
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!account?.address || !targetAddress) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const txHash = await podiumProtocol.cancelSubscription(account.address, targetAddress);
      console.log('Transaction submitted:', txHash);
      
      // Refresh data after transaction
      await fetchOutpostData(targetAddress);
      
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOutpost = async () => {
    if (!account?.address) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const txHash = await podiumProtocol.createOutpost(
        account.address,
        outpostName,
        outpostDescription,
        outpostUri
      );
      console.log('Transaction submitted:', txHash);
      
      // Clear form
      setOutpostName('');
      setOutpostDescription('');
      setOutpostUri('');
      
    } catch (err) {
      console.error('Error creating outpost:', err);
      setError('Failed to create outpost');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nexus Profile</h2>
      
      {!connected ? (
        <div className="mb-4">
          <p className="mb-2">Connect your wallet to manage your profile</p>
          <button
            onClick={connect}
            disabled={walletLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {walletLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="mb-2">Connected as: {account?.address}</p>
          <button
            onClick={disconnect}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}
      
      <form onSubmit={handleAddressSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetAddress">
            Target Address (Individual or Outpost)
          </label>
          <input
            id="targetAddress"
            type="text"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter target address"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !targetAddress.trim()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Profile/Outpost
        </button>
      </form>
      
      {loading ? (
        <div className="text-center py-4">
          <p>Loading data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : outpost ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Outpost Details</h3>
          <p><strong>Name:</strong> {outpost.name}</p>
          <p><strong>Description:</strong> {outpost.description}</p>
          <p><strong>URI:</strong> {outpost.uri}</p>
          <p><strong>Your Pass Balance:</strong> {passBalance}</p>
          <p><strong>Current Pass Price:</strong> {passPrice} MOVE</p>
          
          <div className="mt-4 mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passAmount">
              Pass Amount
            </label>
            <input
              id="passAmount"
              type="number"
              min="1"
              value={passAmount}
              onChange={(e) => setPassAmount(parseInt(e.target.value) || 1)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleBuyPass}
              disabled={loading || !targetAddress}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Buy Pass
            </button>
            <button
              onClick={handleSellPass}
              disabled={loading || !targetAddress || passBalance <= 0}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sell Pass
            </button>
          </div>

          {subscriptionTiers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Subscription Tiers</h3>
              {subscription ? (
                <div className="mb-4">
                  <p><strong>Current Subscription:</strong> Tier {subscription.tierId}</p>
                  <p><strong>Start Time:</strong> {new Date(subscription.startTime).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(subscription.endTime).toLocaleString()}</p>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(parseInt(e.target.value))}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  >
                    {subscriptionTiers.map((tier, index) => (
                      <option key={index} value={index}>
                        {tier.name} - {tier.price} MOVE ({tier.duration} days)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <p>Enter an address to view profile or outpost data.</p>
        </div>
      )}

      <div className="mt-8 border-t pt-4">
        <h3 className="text-xl font-semibold mb-4">Create Outpost</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="outpostName">
            Outpost Name
          </label>
          <input
            id="outpostName"
            type="text"
            value={outpostName}
            onChange={(e) => setOutpostName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter outpost name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="outpostDescription">
            Description
          </label>
          <textarea
            id="outpostDescription"
            value={outpostDescription}
            onChange={(e) => setOutpostDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter outpost description"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="outpostUri">
            URI
          </label>
          <input
            id="outpostUri"
            type="text"
            value={outpostUri}
            onChange={(e) => setOutpostUri(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter outpost URI"
          />
        </div>
        <button
          onClick={handleCreateOutpost}
          disabled={loading || !outpostName || !outpostDescription || !outpostUri}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Outpost
        </button>
      </div>
    </div>
  );
};

export default NexusProfile; 