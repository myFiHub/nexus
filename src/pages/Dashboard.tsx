import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Placeholder/mock data for passes and outposts
const mockPasses = [
  { id: 1, outpostName: 'Creator Alpha', balance: 2, currentPrice: 1.5 },
  { id: 2, outpostName: 'Creator Beta', balance: 1, currentPrice: 2.1 },
];
const mockOutposts = [
  { address: '0x123', name: 'Outpost Gamma', description: 'A new outpost for creators.', currentPrice: 1.2 },
  { address: '0x456', name: 'Outpost Delta', description: 'Join the Delta community.', currentPrice: 0.9 },
];

const Dashboard: React.FC = () => {
  const wallet = useSelector((state: RootState) => state.wallet);

  return (
    <div className="min-h-screen bg-podium-page-bg text-podium-primary-text py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="bg-podium-card-bg rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          {/* Wallet Connection Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            {wallet.address ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p>Connected: <span className="font-mono">{wallet.address}</span></p>
                    <p className="text-sm text-podium-primary-text">Wallet Type: N/A</p>
                  </div>
                  <button className="btn-secondary">Disconnect</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button className="btn-primary">Connect Wallet</button>
              </div>
            )}
          </div>
          {/* User Passes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Passes</h2>
            {mockPasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPasses.map((pass) => (
                  <div key={pass.id} className="bg-podium-card-bg p-4 rounded-lg border border-podium-card-border">
                    <h3 className="font-semibold">{pass.outpostName}</h3>
                    <p className="text-podium-primary-text">Balance: {pass.balance}</p>
                    <p className="text-podium-primary-text">Current Price: {pass.currentPrice} MOVE</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-podium-primary-text">No passes found.</p>
            )}
          </div>
          {/* Outposts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Outposts</h2>
            {mockOutposts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockOutposts.map((outpost) => (
                  <div key={outpost.address} className="bg-podium-card-bg p-4 rounded-lg border border-podium-card-border">
                    <h3 className="font-semibold">{outpost.name}</h3>
                    <p className="text-podium-primary-text">{outpost.description}</p>
                    <p className="text-podium-primary-text mt-2">Price: {outpost.currentPrice} MOVE</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-podium-primary-text">No outposts available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 