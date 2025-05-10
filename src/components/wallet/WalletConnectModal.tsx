import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import walletService from '../../services/walletService';
import { RootState } from '../../redux/store';
import Card from '../Card';
import Button from '../Button';
import { 
  selectWalletAddress, 
  selectWalletIsConnecting, 
  selectWalletError 
} from '../../redux/walletSelectors';

// Inline SVGs for wallet providers
const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g><path fill="#4285F4" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148s2.75-6.148 6.125-6.148c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.703 0-.652-.07-1.148-.156-1.477z"/><path fill="#34A853" d="M3.545 7.548l3.289 2.414c.898-1.367 2.367-2.367 4.166-2.367 1.148 0 2.18.398 2.984 1.172l2.242-2.242c-1.367-1.273-3.125-2.023-5.226-2.023-3.992 0-7.242 3.25-7.242 7.242 0 1.133.258 2.203.711 3.148z"/><path fill="#FBBC05" d="M12 22c2.484 0 4.57-.82 6.094-2.227l-2.812-2.297c-.789.531-1.797.844-3.281.844-2.523 0-4.664-1.703-5.438-4.008h-3.32v2.523c1.523 3.008 4.703 5.165 8.757 5.165z"/><path fill="#EA4335" d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148s2.75-6.148 6.125-6.148c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.703 0-.652-.07-1.148-.156-1.477z" opacity=".1"/></g></svg>
);
const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g><path fill="#1DA1F2" d="M22.46 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.6 1.67 4.905c-.386.664-.607 1.437-.607 2.26 0 1.56.795 2.936 2.005 3.744-.738-.023-1.432-.226-2.04-.563v.057c0 2.18 1.55 4.002 3.604 4.418-.377.104-.775.16-1.185.16-.29 0-.57-.028-.845-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.698z"/></g></svg>
);
const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g><rect width="24" height="24" rx="4" fill="#EA4335"/><path d="M6 8l6 5 6-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="8" width="12" height="8" rx="2" fill="#fff"/></g></svg>
);
const NightlyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><g><circle cx="12" cy="12" r="10" fill="#6C63FF"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#fff"/></g></svg>
);

/**
 * WalletConnectModal: Modern, on-brand modal for wallet connection
 */
const WalletConnectModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) => state.wallet);
  const [localLoading, setLocalLoading] = useState(false);
  const address = useSelector(selectWalletAddress);
  const isConnecting = useSelector(selectWalletIsConnecting);
  const error = useSelector(selectWalletError);

  React.useEffect(() => {
    if (open) console.debug('[WalletConnectModal] Opened');
    if (open && !address) {
      walletService.syncWalletSession(dispatch);
    }
  }, [open, address, dispatch]);

  React.useEffect(() => {
    if (address && open) {
      console.debug('[WalletConnectModal] Wallet connected, closing modal');
      onClose();
    }
  }, [address, open, onClose]);

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

  const isConnected = Boolean(address);

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
          className="absolute top-4 right-4 text-neutral-500 hover:text-[var(--color-primary)] text-2xl font-bold focus:outline-none"
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
        {isConnected && address && (
          <div className="mb-4 text-center">
            <div className="text-xs text-[var(--color-success)] mb-2">Connected: <span className="font-mono">{address}</span></div>
            <Button variant="secondary" onClick={handleDisconnect} disabled={isConnecting || localLoading}>
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
            <GoogleIcon /> Login with Google
          </Button>
          <Button
            variant="primary"
            onClick={() => handleWeb3AuthClick('twitter')}
            disabled={localLoading || wallet.isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <TwitterIcon /> Login with Twitter
          </Button>
          <Button
            variant="primary"
            onClick={() => handleWeb3AuthClick('email_passwordless')}
            disabled={localLoading || wallet.isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <EmailIcon /> Login with Email
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={handleNightlyClick}
          disabled={wallet.isConnecting || localLoading}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <NightlyIcon /> Connect with Nightly Wallet
        </Button>
        {/* Show error if present */}
        {error && (
          <div className="text-[var(--color-error)] text-sm mb-2 text-center">{error}</div>
        )}
        {/* Loading state */}
        {(isConnecting || localLoading) && (
          <div className="flex justify-center my-2">
            <span className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" aria-label="Loading" />
            <span className="ml-2 text-[var(--color-text-muted)]">Connecting...</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WalletConnectModal; 