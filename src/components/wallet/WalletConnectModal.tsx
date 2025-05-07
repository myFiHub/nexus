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
  }, [open]);

  // Close modal on successful connection
  React.useEffect(() => {
    if (wallet.address && open) {
      console.debug('[WalletConnectModal] Wallet connected, closing modal');
      onClose();
    }
  }, [wallet.address, open, onClose]);

  const handleWeb3AuthClick = async () => {
    console.debug('[WalletConnectModal] Web3Auth v9 clicked');
    setLocalLoading(true);
    try {
      const result = await walletService.connectWallet(dispatch, 'web3auth');
      console.debug('[WalletConnectModal] Web3Auth connect result:', result);
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

  React.useEffect(() => {
    if (!open) console.debug('[WalletConnectModal] Closed');
  }, [open]);

  if (!open) return null;

  return (
    <div className="wallet-connect-modal">
      <div className="modal-content">
        <h3>Connect Your Wallet</h3>
        {wallet.error && <div className="error">{wallet.error}</div>}
        <button onClick={handleWeb3AuthClick} disabled={wallet.isConnecting || localLoading}>
          {wallet.isConnecting || localLoading ? 'Connecting...' : 'Connect with Web3Auth v9'}
        </button>
        <button onClick={handleNightlyClick} disabled={wallet.isConnecting || localLoading}>
          {wallet.isConnecting || localLoading ? 'Connecting...' : 'Connect with Nightly Wallet'}
        </button>
        <button onClick={onClose} disabled={wallet.isConnecting || localLoading}>Cancel</button>
      </div>
    </div>
  );
};

export default WalletConnectModal; 