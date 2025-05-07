import { Web3Auth } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { AptosAccount } from "aptos";
import { Buffer } from "buffer";
import { WEB3AUTH_CONFIG, STORAGE_KEYS, FEATURE_FLAGS } from "../config/config";
import { AuthAdapter } from '@web3auth/auth-adapter';

// Initialize Web3Auth
const web3auth = new Web3Auth({
  clientId: WEB3AUTH_CONFIG.CLIENT_ID,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.APTOS,
    chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.CHAIN_ID,
    rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.RPC_TARGET,
    displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.DISPLAY_NAME,
    blockExplorer: WEB3AUTH_CONFIG.CHAIN_CONFIG.BLOCK_EXPLORER,
    ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.TICKER,
    tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.TICKER_NAME,
  },
});

// After initializing web3auth, configure the AuthAdapter
const authAdapter = new AuthAdapter();
web3auth.configureAdapter(authAdapter);

class AuthService {
  constructor() {
    this.web3auth = web3auth;
    this.provider = null;
    this.account = null;
    this.address = null;
    this.isConnected = false;
    this.listeners = [];
    this.externalWalletType = null; // 'nightly' or null for Web3Auth
  }

  /**
   * Initialize the auth service
   */
  async init() {
    try {
      // Initialize Web3Auth if it's not already initialized
      if (this.web3auth && !this.web3auth.connected) { // Check if web3auth object exists and not connected
          await this.web3auth.init();
      }
      
      // Check if there's a stored external wallet
      const storedWallet = localStorage.getItem(STORAGE_KEYS.EXTERNAL_WALLET);
      if (storedWallet) {
        try {
          const walletData = JSON.parse(storedWallet);
          if (walletData.type === 'nightly' && walletData.address) {
            this.externalWalletType = walletData.type;
            this.address = walletData.address;
            // this.account = new AptosAccount(undefined, this.address); // Placeholder, no PK
            this.account = null; // Or a placeholder object
            this.isConnected = true;
            console.log('Restored Nightly wallet session:', this.address);
            this.notifyListeners();
          } else {
            // Clear invalid stored data
            localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
          }
        } catch (error) {
          console.error('Error initializing external wallet from storage:', error);
          localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
        }
      } else if (this.web3auth && this.web3auth.connected) {
        // If not using external wallet, check if Web3Auth is already connected (e.g. session persisted)
        this.provider = this.web3auth.provider;
        if (this.provider) {
            const privateKey = await this.provider.request({ method: "private_key" });
            this.account = new AptosAccount(Buffer.from(privateKey, 'hex'));
            this.address = this.account.address();
            this.isConnected = true;
            this.externalWalletType = null;
            console.log('Restored Web3Auth session:', this.address);
            this.notifyListeners();
        } else {
             // This case should ideally not happen if web3auth.connected is true
             console.warn('Web3Auth connected but provider is null during init.');
        }
      }
    } catch (error) {
      console.error('Error initializing AuthService:', error);
      // Ensure Web3Auth related properties are reset if its initialization failed
      if (error.message.includes('Web3Auth')) {
        this.provider = null;
        this.account = null;
        this.address = null;
        this.isConnected = false;
      }
    }
  }

  /**
   * Connect with Web3Auth (social login)
   * @param {string} loginProvider - The social login provider ('google', 'twitter', 'email_passwordless')
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async connectWeb3Auth(loginProvider = 'google') {
    if (!FEATURE_FLAGS.ENABLE_SOCIAL_LOGIN) {
      console.error('Social login is disabled');
      return false;
    }

    try {
      // If already connected, logout first to allow a new login
      if (this.web3auth && this.web3auth.connected) {
        console.warn('Web3Auth already connected. Logging out before new login.');
        await this.web3auth.logout();
        this.provider = null;
        this.account = null;
        this.address = null;
        this.isConnected = false;
        this.externalWalletType = null;
      }
      // Pass the loginProvider to the Web3Auth connection
      this.provider = await this.web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider,
      });
      if (this.provider) {
        // Get the private key from the provider
        const privateKey = await this.provider.request({ method: "private_key" });
        // Create an Aptos account from the private key
        this.account = new AptosAccount(Buffer.from(privateKey, 'hex'));
        this.address = this.account.address();
        this.isConnected = true;
        this.externalWalletType = null;
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting with Web3Auth:', error);
      return false;
    }
  }

  /**
   * Connect with Nightly wallet (Aptos)
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async connectNightlyWallet() {
    if (!FEATURE_FLAGS.ENABLE_EXTERNAL_WALLET) {
      console.error('External wallet connection is disabled');
      return false;
    }

    try {
      // Check for all possible Nightly wallet injection points
      const nightly = window.nightly || (window.aptos && window.aptos.isNightly ? window.aptos : null);
      const nightlyAptos = nightly && nightly.aptos ? nightly.aptos : nightly;
      if (!nightlyAptos) {
        console.error('Nightly wallet (Aptos) is not detected.');
        alert('Nightly Wallet extension not detected. Please install it from https://nightly.app/download and refresh the page.');
        throw new Error('Nightly wallet (Aptos) is not installed or not available.');
      }
      // Request connection to Nightly Aptos wallet
      await nightlyAptos.connect();
      // After successful connection, get the account info from Nightly
      const nightlyAccountInfo = await nightlyAptos.account();
      if (nightlyAccountInfo && nightlyAccountInfo.address && nightlyAccountInfo.publicKey) {
        this.address = nightlyAccountInfo.address.toString();
        this.account = null; // No private key for external wallet
        console.log(`Nightly wallet connected. Address: ${this.address}, PublicKey: ${nightlyAccountInfo.publicKey}`);
        this.isConnected = true;
        this.externalWalletType = 'nightly';
        // Store minimal necessary info; avoid storing private keys from external wallets
        localStorage.setItem(STORAGE_KEYS.EXTERNAL_WALLET, JSON.stringify({
          type: 'nightly',
          address: this.address,
          publicKey: nightlyAccountInfo.publicKey.toString(),
        }));
        this.notifyListeners();
        return true;
      } else {
        console.error('Nightly wallet connected but failed to retrieve account information.');
        throw new Error('Failed to retrieve account information from Nightly wallet.');
      }
    } catch (error) {
      console.error('Error connecting to Nightly wallet:', error);
      // Attempt to disconnect or clean up if a partial connection was made
      const nightly = window.nightly || (window.aptos && window.aptos.isNightly ? window.aptos : null);
      const nightlyAptos = nightly && nightly.aptos ? nightly.aptos : nightly;
      if (nightlyAptos && typeof nightlyAptos.disconnect === 'function') {
        await nightlyAptos.disconnect().catch(disconnectError => {
          console.warn('Error trying to disconnect from Nightly after connection failure:', disconnectError);
        });
      }
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
      return false;
    }
  }

  /**
   * Disconnect from the wallet (Web3Auth or Nightly)
   */
  async disconnect() {
    // Disconnect from Nightly wallet if connected
    if (this.externalWalletType === 'nightly') {
      const nightly = window.nightly || (window.aptos && window.aptos.isNightly ? window.aptos : null);
      const nightlyAptos = nightly && nightly.aptos ? nightly.aptos : nightly;
      if (nightlyAptos && typeof nightlyAptos.disconnect === 'function') {
        try {
          await nightlyAptos.disconnect();
          console.log('Disconnected from Nightly wallet.');
        } catch (error) {
          console.error('Error disconnecting from Nightly wallet:', error);
        }
      }
      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
    } else if (this.web3auth && this.web3auth.connected) {
      // Disconnect from Web3Auth
      try {
        await this.web3auth.logout();
        console.log('Logged out from Web3Auth.');
      } catch (error) {
        console.error('Error logging out from Web3Auth:', error);
      }
      this.provider = null;
      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
    } else {
      // Fallback: clear all state
      this.provider = null;
      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
    }
    this.notifyListeners();
  }

  /**
   * Get the current account
   * @returns {AptosAccount|null} - The current account
   */
  getAccount() {
    return this.account;
  }

  /**
   * Get the current address
   * @returns {string|null} - The current address
   */
  getAddress() {
    return this.address;
  }

  /**
   * Check if the wallet is connected
   * @returns {boolean} - Whether the wallet is connected
   */
  isWalletConnected() {
    return this.isConnected;
  }

  /**
   * Get the type of wallet connection
   * @returns {string|null} - The type of wallet connection
   */
  getWalletType() {
    if (this.externalWalletType) {
      return this.externalWalletType;
    } else if (this.isConnected) {
      return 'web3auth';
    }
    return null;
  }

  /**
   * Add a listener for wallet state changes
   * @param {Function} listener - The listener function
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener for wallet state changes
   * @param {Function} listener - The listener function
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of wallet state changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener({
      isConnected: this.isConnected,
      address: this.address,
      walletType: this.getWalletType()
    }));
  }
}

export default new AuthService(); 