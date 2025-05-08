import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import walletService from '../../services/walletService';
import WalletConnectModal from '../wallet/WalletConnectModal';

const shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);
const formatBalance = (balance: string) => {
  if (!balance) return '0';
  const num = Number(balance) / 1e8;
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleConnectClick = () => setWalletModalOpen(true);
  const handleDisconnectClick = async () => {
    await walletService.disconnectWallet(dispatch);
  };

  return (
    <nav className="bg-podium-card-bg border-b border-podium-card-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-podium-primary-blue">
            Podium Nexus
          </Link>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/profile')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/settings')
                  ? 'bg-podium-primary-blue text-podium-black'
                  : 'text-podium-primary-text hover:bg-podium-secondary-blue hover:text-podium-white'
              }`}
            >
              Settings
            </Link>
          </div>
          {/* Wallet Status */}
          <div className="flex items-center space-x-2">
            {wallet.address ? (
              <>
                <span className="font-mono bg-gray-800 rounded px-2 py-1 text-xs">{shortenAddress(wallet.address)}</span>
                <span className="text-fuchsia-400 font-semibold text-xs">{formatBalance(wallet.balance)} MOVE</span>
                <button
                  className="btn-secondary px-3 py-1 text-xs"
                  onClick={handleDisconnectClick}
                  disabled={wallet.isConnecting}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn-primary px-3 py-1 text-xs"
                onClick={handleConnectClick}
                disabled={wallet.isConnecting}
              >
                Connect Wallet
              </button>
            )}
            <WalletConnectModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 