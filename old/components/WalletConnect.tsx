import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import walletService from '../../services/walletService';
import { RootState } from '../../redux/store';
import Card from '../common/Card';
import Button from '../common/Button';
import Skeleton from '../common/Skeleton';

// Wallet icons (placeholder emojis, replace with SVGs as needed)
const WALLET_ICONS = {
  google: '🔵',
  twitter: '🐦',
  email: '✉️',
  nightly: '🌙',
};

/**
 * WalletConnectModal: Modern, on-brand modal for wallet connection
 */
const WalletConnectModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [localLoading, setLocalLoading] = useState(false);

  React.useEffect(() => {
    if (open) console.debug('[WalletConnectModal] Opened');
    if (open && !wallet.address) {
      walletService.syncWalletSession(dispatch);
    }
  }, [open, wallet.address, dispatch]);

  React.useEffect(() => {
    if (wallet.address && open) {
      console.debug('[WalletConnectModal] Wallet connected, closing modal');
      onClose();
    }
  }, [wallet.address, open, onClose]);

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
    setLocalLoading(true);
    try {
      await walletService.connectWallet(dispatch, 'nightly');
      console.debug('[WalletConnectModal] Nightly Wallet connect');
    } catch (e) {
      console.error('[WalletConnectModal] Nightly Wallet connect error:', e);
    } finally {
      setLocalLoading(false);
    }
  };

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

  if (!open) return null;

  const isConnected = Boolean(wallet.address);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <Card className="relative w-full max-w-md p-8 mx-4 animate-fade-in">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-neutral-500 hover:text-primary-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close wallet connect modal"
          disabled={wallet.isConnecting || localLoading}
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-4 text-center">Connect Your Wallet</h3>
        {/* Connection status */}
        <div className="flex justify-center mb-4">
          <span
            className={`inline-block w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-400'} border-2 border-white shadow`}
            title={isConnected ? 'Connected' : 'Disconnected'}
          />
        </div>
        {/* Show address if connected */}
        {isConnected && wallet.address && (
          <div className="mb-4 text-center">
            <div className="text-xs text-success mb-2">Connected: <span className="font-mono">{wallet.address}</span></div>
            <Button variant="secondary" onClick={handleDisconnect} disabled={wallet.isConnecting || localLoading}>
              Disconnect
            </Button>
          </div>
        )}
        {/* Social login provider buttons */}
        <div className="flex flex-col gap-3 mb-4">
          <Button
            variant="primary"
            onClick={() => handleWeb3AuthClick('google')}
            disabled={localLoading || wallet.isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <span>{WALLET_ICONS.google}</span> Login with Google
          </Button>
          <Button
            variant="primary"
            onClick={() => handleWeb3AuthClick('twitter')}
            disabled={localLoading || wallet.isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <span>{WALLET_ICONS.twitter}</span> Login with Twitter
          </Button>
          <Button
            variant="primary"
            onClick={() => handleWeb3AuthClick('email_passwordless')}
            disabled={localLoading || wallet.isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <span>{WALLET_ICONS.email}</span> Login with Email
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={handleNightlyClick}
          disabled={wallet.isConnecting || localLoading}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <span>{WALLET_ICONS.nightly}</span> Connect with Nightly Wallet
        </Button>
        {/* Show error if present */}
        {wallet.error && (
          <div className="text-error text-sm mb-2 text-center">{wallet.error}</div>
        )}
        {/* Loading state */}
        {(wallet.isConnecting || localLoading) && (
          <div className="flex justify-center my-2">
            <Skeleton width={32} height={32} className="rounded-full" />
            <span className="ml-2 text-neutral-500">Connecting...</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WalletConnectModal; 