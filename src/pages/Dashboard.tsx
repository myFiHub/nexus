import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

// Types for mock data
interface UserPass {
  id: number;
  outpostName: string;
  balance: number;
  currentPrice: number;
}

interface Outpost {
  address: string;
  name: string;
  description: string;
  currentPrice: number;
}

// Mock data and state for demonstration (replace with real hooks/services)
const mockWallet = '0x1234...abcd';
const mockWalletType = 'web3auth';
const mockIsConnected = false;
const mockIsLoading = false;
const mockError = null;
const mockUserPasses: UserPass[] = [
  { id: 1, outpostName: 'Creator Alpha', balance: 2, currentPrice: 100000000 },
];
const mockOutposts: Outpost[] = [
  { address: '0xoutpost1', name: 'Outpost One', description: 'A great creator outpost.', currentPrice: 200000000 },
];

const Dashboard: React.FC = () => {
  // Replace with real wallet connection logic
  const [isConnected, setIsConnected] = useState(mockIsConnected);
  const [isLoading, setIsLoading] = useState(mockIsLoading);
  const [error, setError] = useState<typeof mockError>(mockError);
  const [wallet] = useState(mockWallet);
  const [walletType] = useState(mockWalletType);
  const [userPasses] = useState<UserPass[]>(mockUserPasses);
  const [outposts] = useState<Outpost[]>(mockOutposts);

  // Handlers (replace with real logic)
  const handleWeb3AuthConnect = () => setIsConnected(true);
  const handleNightlyConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Dashboard</h1>

          {/* Wallet Connection Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            {!isConnected ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Connect with Social Login</h3>
                  <Button onClick={handleWeb3AuthConnect} className="w-full mb-2">Connect with Web3Auth</Button>
                  <p className="text-sm text-[var(--color-text-muted)]">Sign in with Google, Twitter, or other social accounts</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Connect External Wallet</h3>
                  <Button variant="secondary" onClick={handleNightlyConnect} className="w-full mb-2">Connect Nightly Wallet</Button>
                  <p className="text-sm text-[var(--color-text-muted)]">Use your existing Nightly wallet</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-[var(--color-text-main)]">Connected: <span className="font-mono">{wallet}</span></p>
                  <p className="text-sm text-[var(--color-text-muted)]">Wallet Type: {walletType === 'web3auth' ? 'Web3Auth (Social Login)' : 'Nightly Wallet'}</p>
                </div>
                <Button variant="secondary" onClick={handleDisconnect}>Disconnect</Button>
              </div>
            )}
          </section>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <p className="text-[var(--color-text-muted)] mt-2">Loading...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded mb-4">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          {/* User Passes Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Passes</h2>
            {userPasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPasses.map((pass) => (
                  <Card key={pass.id} className="bg-[var(--color-bg)]">
                    <h3 className="font-semibold">{pass.outpostName}</h3>
                    <p className="text-[var(--color-text-muted)]">Balance: {pass.balance}</p>
                    <p className="text-[var(--color-text-muted)]">Current Price: {pass.currentPrice / 100000000} APT</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)]">No passes found.</p>
            )}
          </section>

          {/* Outposts Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Available Outposts</h2>
            {outposts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outposts.map((outpost) => (
                  <Card key={outpost.address} className="bg-[var(--color-bg)]">
                    <h3 className="font-semibold">{outpost.name}</h3>
                    <p className="text-[var(--color-text-muted)]">{outpost.description}</p>
                    <p className="text-[var(--color-text-muted)] mt-2">Price: {outpost.currentPrice / 100000000} APT</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)]">No outposts available.</p>
            )}
          </section>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard; 