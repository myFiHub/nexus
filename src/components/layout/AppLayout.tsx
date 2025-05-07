import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import walletService from '../../services/walletService';
import WalletConnectModal from '../wallet/WalletConnectModal';
import podiumLogo from '../../assets/images/podiumNexuslogo.png';

// Helper to shorten address
const shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);

// Helper to format balance
const formatBalance = (balance: string) => {
  if (!balance) return '0';
  // MOVE has 8 decimals
  const num = Number(balance) / 1e8;
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

// AppLayout: Main layout wrapper for the application
// Includes navigation, wallet status, and main content area
// Debug printout for mounting
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    console.debug('[AppLayout] Mounted');
  }, []);

  const handleConnectClick = () => {
    setWalletModalOpen(true);
  };

  const handleDisconnectClick = async () => {
    await walletService.disconnectWallet(dispatch);
  };

  return (
    <div className="app-layout">
      {/* Navigation bar with branding/logo and wallet status */}
      <nav className="app-nav">
        <div className="app-branding" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={podiumLogo} alt="Podium Nexus Logo" style={{ height: 40 }} />
          <span style={{ fontWeight: 700, fontSize: 22 }}>Podium Platform</span>
        </div>
        <div className="wallet-status">
          {wallet.address ? (
            <>
              <span className="wallet-address">{shortenAddress(wallet.address)}</span>
              <span className="wallet-balance">{formatBalance(wallet.balance)} MOVE</span>
              <button onClick={handleDisconnectClick} disabled={wallet.isConnecting}>
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={handleConnectClick} disabled={wallet.isConnecting}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
      {/* Main content area */}
      <main className="app-content">
        {children}
      </main>
      {/* Wallet connect modal */}
      <WalletConnectModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </div>
  );
};

export default AppLayout; 