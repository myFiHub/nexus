import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WalletConnectModal from './wallet/WalletConnectModal';
import { RootState } from '../redux/store';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Profile', href: '/profile' },
  { name: 'Settings', href: '/settings' },
];

function shortenAddress(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const wallet = useSelector((state: RootState) => state.wallet);

  return (
    <nav className="w-full bg-[var(--color-surface)] border-b border-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand/Logo */}
        <Link to="/" className="text-xl font-bold text-[var(--color-primary)] tracking-tight focus:outline-none">
          Podium Nexus
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium transition-colors duration-200 focus:outline-none focus:text-[var(--color-primary)]"
            >
              {link.name}
            </Link>
          ))}
          {/* Wallet Connect Button */}
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors duration-200 focus:outline-none"
            onClick={() => setWalletModalOpen(true)}
            aria-label={wallet.address ? `Wallet: ${wallet.address}` : 'Connect Wallet'}
          >
            {wallet.address ? shortenAddress(wallet.address) : 'Connect Wallet'}
          </button>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[var(--color-primary)] focus:outline-none"
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-t border-[var(--color-bg)] px-4 py-2 flex flex-col gap-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-medium py-2 transition-colors duration-200 focus:outline-none focus:text-[var(--color-primary)]"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Wallet Connect Button (Mobile) */}
          <button
            className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors duration-200 focus:outline-none"
            onClick={() => { setWalletModalOpen(true); setMenuOpen(false); }}
            aria-label={wallet.address ? `Wallet: ${wallet.address}` : 'Connect Wallet'}
          >
            {wallet.address ? shortenAddress(wallet.address) : 'Connect Wallet'}
          </button>
        </div>
      )}
      {/* Wallet Connect Modal */}
      <WalletConnectModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </nav>
  );
};

export default Navbar; 