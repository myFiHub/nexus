import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

function Profile() {
  const {
    walletState,
    isConnected,
    userPasses,
    isLoading,
    error
  } = useApp();

  const [profileData, setProfileData] = useState({
    username: 'User',
    bio: 'No bio available',
    avatar: 'https://via.placeholder.com/150',
    joinedDate: new Date().toLocaleDateString(),
    socialLinks: {
      twitter: '',
      discord: '',
      github: ''
    }
  });

  // Mock function to fetch profile data
  useEffect(() => {
    if (isConnected) {
      // In a real implementation, this would fetch from an API
      setProfileData({
        username: 'Creator123',
        bio: 'Content creator and community builder on Podium Nexus.',
        avatar: 'https://via.placeholder.com/150',
        joinedDate: 'January 15, 2023',
        socialLinks: {
          twitter: 'https://twitter.com/creator123',
          discord: 'https://discord.gg/creator123',
          github: 'https://github.com/creator123'
        }
      });
    }
  }, [isConnected]);

  return (
    <div className="space-y-8">
      <div className="bg-podium-card-bg rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-podium-text mb-6">Profile</h1>
        
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
            <h2 className="text-2xl font-bold text-podium-text mb-2">{profileData.username}</h2>
            <p className="text-podium-secondary-text mb-4">{profileData.bio}</p>
            <p className="text-podium-secondary-text mb-4">Joined: {profileData.joinedDate}</p>
            
            <div className="flex gap-4">
              {profileData.socialLinks.twitter && (
                <a 
                  href={profileData.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-podium-primary-blue hover:underline"
                >
                  Twitter
                </a>
              )}
              {profileData.socialLinks.discord && (
                <a 
                  href={profileData.socialLinks.discord} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-podium-primary-blue hover:underline"
                >
                  Discord
                </a>
              )}
              {profileData.socialLinks.github && (
                <a 
                  href={profileData.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-podium-primary-blue hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Wallet Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-podium-text mb-4">Wallet Information</h3>
          {isConnected ? (
            <div className="bg-podium-secondary-bg p-4 rounded-lg">
              <p className="text-podium-text">Address: {walletState.address}</p>
              <p className="text-podium-text">Wallet Type: {walletState.walletType === 'web3auth' ? 'Web3Auth (Social Login)' : 'Nightly Wallet'}</p>
            </div>
          ) : (
            <p className="text-podium-text-secondary">Connect your wallet to view wallet information.</p>
          )}
        </div>
        
        {/* Activity Section */}
        <div>
          <h3 className="text-xl font-semibold text-podium-text mb-4">Recent Activity</h3>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-podium-primary-blue mx-auto"></div>
              <p className="text-podium-text mt-2">Loading activity...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : userPasses.length > 0 ? (
            <div className="space-y-4">
              {userPasses.map((pass) => (
                <div key={pass.id} className="bg-podium-secondary-bg p-4 rounded-lg">
                  <p className="text-podium-text">Purchased {pass.balance} passes for {pass.outpostName}</p>
                  <p className="text-podium-text-secondary text-sm">Current Price: {pass.currentPrice / 100000000} APT</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-podium-text-secondary">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 