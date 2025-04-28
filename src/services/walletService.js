import { AptosAccount } from 'aptos';
import { Buffer } from 'buffer';

/**
 * Service for handling wallet connections and user authentication
 */
class WalletService {
  constructor() {
    this.account = null;
    this.address = null;
    this.isConnected = false;
    this.listeners = [];
  }

  /**
   * Initialize the wallet service
   */
  init() {
    // Check if there's a stored wallet
    const storedWallet = localStorage.getItem('podium_wallet');
    if (storedWallet) {
      try {
        const walletData = JSON.parse(storedWallet);
        this.account = new AptosAccount(Buffer.from(walletData.privateKey, 'hex'));
        this.address = this.account.address();
        this.isConnected = true;
        this.notifyListeners();
      } catch (error) {
        console.error('Error initializing wallet:', error);
        localStorage.removeItem('podium_wallet');
      }
    }
  }

  /**
   * Connect to Torus wallet
   * @returns {Promise<boolean>} - Whether the connection was successful
   */
  async connectTorusWallet() {
    try {
      // This is a placeholder for the actual Torus wallet integration
      // In a real implementation, you would use the Torus SDK to connect to the wallet
      
      // For now, we'll create a new account for demonstration purposes
      this.account = new AptosAccount();
      this.address = this.account.address();
      this.isConnected = true;
      
      // Store the wallet data
      localStorage.setItem('podium_wallet', JSON.stringify({
        privateKey: Buffer.from(this.account.signingKey.secretKey).toString('hex')
      }));
      
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error connecting to Torus wallet:', error);
      return false;
    }
  }

  /**
   * Disconnect from the wallet
   */
  disconnect() {
    this.account = null;
    this.address = null;
    this.isConnected = false;
    localStorage.removeItem('podium_wallet');
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
      address: this.address
    }));
  }
}

export default new WalletService(); 