import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./WalletConnect.css";

const WalletConnect: React.FC = () => {
  const {
    walletState,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  // Show wallet options on mount
  useEffect(() => {
    console.log('[WalletConnect] Component mounted, showing wallet options');
    setShowWalletOptions(true);
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('[WalletConnect] State updated:', {
      isConnected,
      isLoading,
      error,
      walletState
    });
  }, [isConnected, isLoading, error, walletState]);

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    console.log('[WalletConnect] Toggling dropdown');
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (
      e.target instanceof Element &&
      (e.target.closest(".wallet-dropdown") || e.target.closest(".wallet-options"))
    )
      return;
    console.log('[WalletConnect] Clicking outside, closing dropdowns');
    setIsDropdownOpen(false);
    setShowWalletOptions(false);
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle wallet connection
  const handleConnect = async (walletType: string) => {
    try {
      console.log(`[WalletConnect] Attempting to connect to ${walletType} wallet...`);
      await connectWallet(walletType);
      console.log(`[WalletConnect] Successfully connected to ${walletType} wallet`);
      setShowWalletOptions(false);
    } catch (error) {
      console.error(`[WalletConnect] Error connecting to ${walletType} wallet:`, error);
      // Show error in UI
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    }
  };

  // Get wallet icon based on type
  const getWalletIcon = (type: string | null) => {
    switch (type) {
      case "web3auth":
        return "🔑"; // Key emoji for Web3Auth
      case "nightly":
        return "🌙"; // Moon emoji for Nightly wallet
      default:
        return "👛"; // Generic wallet emoji
    }
  };

  // Get wallet name for display
  const getWalletName = (type: string | null) => {
    switch (type) {
      case "web3auth":
        return "Web3Auth";
      case "nightly":
        return "Nightly Wallet";
      default:
        return "Unknown Wallet";
    }
  };

  // If loading, show loading button
  if (isLoading) {
    return (
      <button className="wallet-connect-btn loading" disabled>
        <span className="spinner"></span>
        Connecting...
      </button>
    );
  }

  // If connected, show connected button with dropdown
  if (isConnected && walletState) {
    return (
      <div className="wallet-connect-container">
        <button className="wallet-connect-btn connected" onClick={toggleDropdown}>
          <span className="wallet-icon">{getWalletIcon(walletState.type)}</span>
          <span className="wallet-address">{formatAddress(walletState.address)}</span>
          <span className="dropdown-arrow">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="wallet-dropdown">
            <div className="wallet-info">
              <div className="wallet-type">{getWalletName(walletState.type)}</div>
              <div className="wallet-address-full">{walletState.address}</div>
              {walletState.type === "web3auth" && walletState.userInfo && (
                <div className="user-info">
                  <div className="user-email">{walletState.userInfo.email}</div>
                  {walletState.userInfo.name && (
                    <div className="user-name">{walletState.userInfo.name}</div>
                  )}
                </div>
              )}
            </div>
            <button className="disconnect-btn" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  // If not connected, show connect options
  return (
    <div className="wallet-connect-container">
      {showWalletOptions ? (
        <div className="wallet-options">
          <button
            className="wallet-option-btn web3auth"
            onClick={() => handleConnect("web3auth")}
            disabled={isLoading}
          >
            <span className="wallet-icon">🔑</span>
            <span>Continue with Web3Auth</span>
          </button>
          <button
            className="wallet-option-btn nightly"
            onClick={() => handleConnect("nightly")}
            disabled={isLoading}
          >
            <span className="wallet-icon">🌙</span>
            <span>Connect Nightly Wallet</span>
          </button>
          <button
            className="wallet-option-cancel"
            onClick={() => setShowWalletOptions(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="wallet-connect-btn"
          onClick={() => setShowWalletOptions(true)}
          disabled={isLoading}
        >
          Connect Wallet
        </button>
      )}

      {error && <div className="wallet-error">{error}</div>}
    </div>
  );
};

export default WalletConnect; 