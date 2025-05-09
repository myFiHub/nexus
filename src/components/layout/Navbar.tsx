import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import walletService from '../../services/walletService';
import WalletConnectModal from '../wallet/WalletConnectModal';
import Button from '../common/Button';

const shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);
const formatBalance = (balance: string) => {
  if (!balance) return '0';
  const num = Number(balance) / 1e8;
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

/**
 * Navigation link type
 */
type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Explorer', href: '/explorer' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
];

/**
 * Navbar component for main site navigation
 */
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
    <nav className="sticky top-0 z-40 w-full bg-[var(--color-surface)] border-b border-[var(--color-surface)] shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
        {/* Logo */}
        <Link to="/" className="text-[var(--color-primary)] font-extrabold text-xl tracking-wide hover:text-[var(--color-secondary)] transition">
          Podium Nexus
        </Link>
        {/* Nav Links */}
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-3 py-1 rounded-md font-medium transition ${
                isActive(item.href)
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Wallet Status */}
        <div className="flex items-center space-x-2">
          {wallet.address ? (
            <>
              <span className="font-mono bg-[var(--color-bg)] rounded px-2 py-1 text-xs border border-[var(--color-surface)]">{shortenAddress(wallet.address)}</span>
              <span className="text-[var(--color-primary)] font-semibold text-xs">{formatBalance(wallet.balance)} MOVE</span>
              <button
                className="px-3 py-1 text-xs rounded-lg border border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition"
                onClick={handleDisconnectClick}
                disabled={wallet.isConnecting}
              >
                Disconnect
              </button>
            </>
          ) : (
            <Button variant="primary" onClick={handleConnectClick} disabled={wallet.isConnecting}>
              Connect Wallet
            </Button>
          )}
          <WalletConnectModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 