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
      await this.web3auth.init();
      
      // Check if there's a stored external wallet
      const storedWallet = localStorage.getItem(STORAGE_KEYS.EXTERNAL_WALLET);
      if (storedWallet) {
        try {
          const walletData = JSON.parse(storedWallet);
          this.externalWalletType = walletData.type;
          this.account = new AptosAccount(Buffer.from(walletData.privateKey, 'hex'));
          this.address = this.account.address();
          this.isConnected = true;
          this.notifyListeners();
        } catch (error) {
          console.error('Error initializing external wallet:', error);
          localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
        }
      }
    } catch (error) {
      console.error('Error initializing Web3Auth:', error);
    }
  }

  /**
   * Connect with Web3Auth (social login)
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async connectWeb3Auth() {
    if (!FEATURE_FLAGS.ENABLE_SOCIAL_LOGIN) {
      console.error('Social login is disabled');
      return false;
    }

    try {
      this.provider = await this.web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: 'google', // or your preferred provider
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
   * Connect with Nightly wallet
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async connectNightlyWallet() {
    if (!FEATURE_FLAGS.ENABLE_EXTERNAL_WALLET) {
      console.error('External wallet connection is disabled');
      return false;
    }

    try {
      // Check if Nightly wallet is installed
      if (!window.nightly) {
        throw new Error('Nightly wallet is not installed');
      }
      
      // Request connection to Nightly wallet
      const response = await window.nightly.connect();
      
      if (response) {
        // For demonstration purposes, we'll create a new account
        // In a real implementation, you would get the account from the Nightly wallet
        this.account = new AptosAccount();
        this.address = this.account.address();
        this.isConnected = true;
        this.externalWalletType = 'nightly';
        
        // Store the wallet data
        localStorage.setItem(STORAGE_KEYS.EXTERNAL_WALLET, JSON.stringify({
          type: 'nightly',
          privateKey: Buffer.from(this.account.signingKey.secretKey).toString('hex')
        }));
        
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting to Nightly wallet:', error);
      return false;
    }
  }

  /**
   * Disconnect from the wallet
   */
  async disconnect() {
    if (this.externalWalletType) {
      // Disconnect from external wallet
      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
    } else {
      // Disconnect from Web3Auth
      await this.web3auth.logout();
      this.provider = null;
      this.account = null;
      this.address = null;
      this.isConnected = false;
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