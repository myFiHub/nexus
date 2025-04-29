import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

function Dashboard() {
  const {
    wallet,
    isConnected,
    walletType,
    connectWeb3Auth,
    connectNightlyWallet,
    disconnectWallet,
    userPasses,
    outposts,
    isLoading,
    error,
    fetchUserPasses,
    fetchOutposts
  } = useApp();

  console.log('[Dashboard] Component mounted');

  // Fetch data when wallet is connected
  useEffect(() => {
    console.log('[Dashboard] Wallet connection status:', { isConnected, walletType });
    if (isConnected) {
      console.log('[Dashboard] Fetching user data...');
      fetchUserPasses();
      fetchOutposts();
    }
  }, [isConnected, fetchUserPasses, fetchOutposts]);

  const handleWeb3AuthConnect = () => {
    console.log('[Dashboard] Web3Auth connect button clicked');
    connectWeb3Auth();
  };

  const handleNightlyConnect = () => {
    console.log('[Dashboard] Nightly wallet connect button clicked');
    connectNightlyWallet();
  };

  const handleDisconnect = () => {
    console.log('[Dashboard] Disconnect button clicked');
    disconnectWallet();
  };

  return (
    <div className="space-y-8">
      <div className="bg-podium-card-bg rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-podium-text mb-4">Dashboard</h1>
        
        {/* Wallet Connection Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-podium-text mb-4">Wallet Connection</h2>
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-podium-text mb-2">Connect with Social Login</h3>
                <button
                  onClick={handleWeb3AuthConnect}
                  className="bg-podium-primary hover:bg-podium-primary-dark text-white font-bold py-2 px-4 rounded w-full md:w-auto"
                >
                  Connect with Web3Auth
                </button>
                <p className="text-sm text-podium-text-secondary mt-1">
                  Sign in with Google, Twitter, Facebook, or other social accounts
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-podium-text mb-2">Connect External Wallet</h3>
                <button
                  onClick={handleNightlyConnect}
                  className="bg-podium-secondary hover:bg-podium-secondary-dark text-white font-bold py-2 px-4 rounded w-full md:w-auto"
                >
                  Connect Nightly Wallet
                </button>
                <p className="text-sm text-podium-text-secondary mt-1">
                  Use your existing Nightly wallet for Aptos
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-podium-text">Connected: {wallet}</p>
                  <p className="text-sm text-podium-text-secondary">
                    Wallet Type: {walletType === 'web3auth' ? 'Web3Auth (Social Login)' : 'Nightly Wallet'}
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-podium-secondary hover:bg-podium-secondary-dark text-white font-bold py-2 px-4 rounded"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-podium-primary mx-auto"></div>
            <p className="text-podium-text mt-2">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* User Passes Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-podium-text mb-4">Your Passes</h2>
          {userPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPasses.map((pass) => (
                <div key={pass.id} className="bg-podium-secondary-bg p-4 rounded-lg">
                  <h3 className="font-semibold text-podium-text">{pass.outpostName}</h3>
                  <p className="text-podium-text-secondary">Balance: {pass.balance}</p>
                  <p className="text-podium-text-secondary">Current Price: {pass.currentPrice / 100000000} APT</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-podium-text-secondary">No passes found.</p>
          )}
        </div>

        {/* Outposts Section */}
        <div>
          <h2 className="text-xl font-semibold text-podium-text mb-4">Available Outposts</h2>
          {outposts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outposts.map((outpost) => (
                <div key={outpost.address} className="bg-podium-secondary-bg p-4 rounded-lg">
                  <h3 className="font-semibold text-podium-text">{outpost.name}</h3>
                  <p className="text-podium-text-secondary">{outpost.description}</p>
                  <p className="text-podium-text-secondary mt-2">Price: {outpost.currentPrice / 100000000} APT</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-podium-text-secondary">No outposts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 