import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { selectWalletAddress, selectWalletType } from '../redux/walletSelectors';

interface SocialLinks {
  twitter?: string;
  discord?: string;
  github?: string;
}

interface UserPass {
  id: number;
  outpostName: string;
  balance: number;
  currentPrice: number;
}

const mockProfile = {
  username: 'Creator123',
  bio: 'Content creator and community builder on Podium Nexus.',
  avatar: 'https://via.placeholder.com/150',
  joinedDate: 'January 15, 2023',
  socialLinks: {
    twitter: 'https://twitter.com/creator123',
    discord: 'https://discord.gg/creator123',
    github: 'https://github.com/creator123',
  } as SocialLinks,
};

const mockWallet = {
  address: '0x1234...abcd',
  walletType: 'web3auth',
};

const mockIsConnected = true;
const mockIsLoading = false;
const mockError = null;
const mockUserPasses: UserPass[] = [
  { id: 1, outpostName: 'Creator Alpha', balance: 2, currentPrice: 100000000 },
];

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState(mockProfile);
  const address = useSelector(selectWalletAddress);
  const walletType = useSelector(selectWalletType);
  const isConnected = Boolean(address);
  const [isLoading] = useState(mockIsLoading);
  const [error] = useState<typeof mockError>(mockError);
  const [userPasses] = useState<UserPass[]>(mockUserPasses);

  // Simulate fetching profile data
  useEffect(() => {
    // In real implementation, fetch profile data here
    setProfileData(mockProfile);
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Profile</h1>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={profileData.avatar}
              alt={profileData.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{profileData.username}</h2>
            <p className="text-[var(--color-text-muted)] mb-4">{profileData.bio}</p>
            <p className="text-[var(--color-text-muted)] mb-4">Joined: {profileData.joinedDate}</p>
            <div className="flex space-x-4">
              {profileData.socialLinks.twitter && (
                <a
                  href={profileData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Twitter
                </a>
              )}
              {profileData.socialLinks.discord && (
                <a
                  href={profileData.socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Discord
                </a>
              )}
              {profileData.socialLinks.github && (
                <a
                  href={profileData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Wallet Information</h3>
          {isConnected ? (
            <div className="bg-[var(--color-surface)] p-4 rounded-lg">
              <p className="text-[var(--color-text-main)]">Address: <span className="font-mono">{address}</span></p>
              <p className="text-[var(--color-text-muted)]">Wallet Type: {walletType === 'web3auth' ? 'Web3Auth (Social Login)' : walletType === 'nightly' ? 'Nightly Wallet' : walletType || 'Unknown'}</p>
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">Connect your wallet to view wallet information.</p>
          )}
        </div>

        {/* Activity Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <p className="text-[var(--color-text-muted)] mt-2">Loading activity...</p>
            </div>
          ) : error ? (
            <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded mb-4">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          ) : userPasses.length > 0 ? (
            <div className="space-y-4">
              {userPasses.map((pass) => (
                <div key={pass.id} className="bg-[var(--color-bg)] p-4 rounded-lg">
                  <p className="text-[var(--color-text-main)]">Purchased {pass.balance} passes for {pass.outpostName}</p>
                  <p className="text-[var(--color-text-muted)] text-sm">Current Price: {pass.currentPrice / 100000000} APT</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No recent activity.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile; 