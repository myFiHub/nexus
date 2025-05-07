import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import walletService from '../../services/walletService';
import { RootState } from '../../redux/store';

// WalletConnectModal: Modal for connecting wallet (Web3Auth v9 or Nightly Wallet)
// Handles wallet connection, loading, and error states
const WalletConnectModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [localLoading, setLocalLoading] = useState(false);

  React.useEffect(() => {
    if (open) console.debug('[WalletConnectModal] Opened');
    // On modal open, sync Redux state with any existing wallet session if not already connected
    if (open && !wallet.address) {
      walletService.syncWalletSession(dispatch);
    }
  }, [open, wallet.address, dispatch]);

  // Close modal on successful connection
  React.useEffect(() => {
    if (wallet.address && open) {
      console.debug('[WalletConnectModal] Wallet connected, closing modal');
      onClose();
    }
  }, [wallet.address, open, onClose]);

  // Handler for Web3Auth login with provider
  const handleWeb3AuthClick = async (provider: 'google' | 'twitter' | 'email_passwordless') => {
    setLocalLoading(true);
    try {
      await walletService.connectWallet(dispatch, 'web3auth', provider);
      console.debug('[WalletConnectModal] Web3Auth', provider, 'clicked');
    } catch (e) {
      console.error('[WalletConnectModal] Web3Auth connect error:', e);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleNightlyClick = async () => {
    console.debug('[WalletConnectModal] Nightly Wallet clicked');
    setLocalLoading(true);
    try {
      const result = await walletService.connectWallet(dispatch, 'nightly');
      console.debug('[WalletConnectModal] Nightly Wallet connect result:', result);
    } catch (e) {
      console.error('[WalletConnectModal] Nightly Wallet connect error:', e);
    } finally {
      setLocalLoading(false);
    }
  };

  // Disconnect handler
  const handleDisconnect = async () => {
    setLocalLoading(true);
    try {
      await walletService.disconnectWallet(dispatch);
      console.debug('[WalletConnectModal] Disconnected wallet');
    } catch (e) {
      console.error('[WalletConnectModal] Disconnect error:', e);
    } finally {
      setLocalLoading(false);
    }
  };

  React.useEffect(() => {
    if (!open) console.debug('[WalletConnectModal] Closed');
  }, [open]);

  if (!open) return null;

  // Connection status dot style
  const isConnected = Boolean(wallet.address);
  const statusDotStyle = {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: isConnected ? '#27ae60' : '#e74c3c',
    marginLeft: 8,
    border: '1.5px solid #fff',
    boxShadow: '0 0 2px #0002',
    verticalAlign: 'middle',
  };

  return (
    <div className="wallet-connect-modal">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Connect Your Wallet</h3>
          {/* Status dot at top right */}
          <span style={statusDotStyle} title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
        {/* Show address if connected */}
        {isConnected && wallet.address && (
          <>
            <div style={{ fontSize: 12, color: '#27ae60', marginBottom: 8 }}>
              Connected: {wallet.address}
            </div>
            <button
              onClick={handleDisconnect}
              disabled={wallet.isConnecting || localLoading}
              style={{ marginBottom: 8 }}
            >
              Disconnect
            </button>
          </>
        )}
        {/* Social login provider buttons */}
        <div style={{ margin: '16px 0' }}>
          <button
            style={{ marginRight: 8 }}
            disabled={localLoading || wallet.isConnecting}
            onClick={() => handleWeb3AuthClick('google')}
          >
            Login with Google
          </button>
          <button
            style={{ marginRight: 8 }}
            disabled={localLoading || wallet.isConnecting}
            onClick={() => handleWeb3AuthClick('twitter')}
          >
            Login with Twitter
          </button>
          <button
            disabled={localLoading || wallet.isConnecting}
            onClick={() => handleWeb3AuthClick('email_passwordless')}
          >
            Login with Email
          </button>
        </div>
        {/* Show error if present */}
        {wallet.error && (
          <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 8 }}>
            {wallet.error}
          </div>
        )}
        <button onClick={handleNightlyClick} disabled={wallet.isConnecting || localLoading}>
          {wallet.isConnecting || localLoading ? 'Connecting...' : 'Connect with Nightly Wallet'}
        </button>
        <button onClick={onClose} disabled={wallet.isConnecting || localLoading}>Cancel</button>
      </div>
    </div>
  );
};

export default WalletConnectModal; 