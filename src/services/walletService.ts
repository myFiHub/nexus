import { AptosAccount } from "aptos";
import { Buffer } from "buffer";
import { STORAGE_KEYS } from "../config/config";
import web3AuthService from "./web3AuthService";

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface WalletConnection {
  address: string;
  chainId: string;
  provider: string;
}

export enum WalletErrorType {
  CONNECTION_ERROR = "CONNECTION_ERROR",
  TRANSACTION_ERROR = "TRANSACTION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
}

export interface WalletError {
  type: WalletErrorType;
  message: string;
  code: number;
  details?: any;
}

class WalletService {
  private account: AptosAccount | null;
  private address: string | null;
  private isConnected: boolean;
  private listeners: ((state: any) => void)[];
  private externalWalletType: string | null;

  constructor() {
    this.account = null;
    this.address = null;
    this.isConnected = false;
    this.listeners = [];
    this.externalWalletType = null;
  }

  /**
   * Initialize the wallet service
   */
  async init(): Promise<void> {
    try {
      console.log('[WalletService] Starting initialization...');
      
      // Initialize Web3Auth
      console.log('[WalletService] Initializing Web3Auth...');
      await web3AuthService.initialize();
      console.log('[WalletService] Web3Auth initialized successfully');

      // Check if there's a stored external wallet
      const storedWallet = localStorage.getItem(STORAGE_KEYS.EXTERNAL_WALLET);
      console.log('[WalletService] Checking for stored wallet:', storedWallet ? 'Found' : 'Not found');
      
      if (storedWallet) {
        try {
          console.log('[WalletService] Attempting to restore stored wallet...');
          const walletData = JSON.parse(storedWallet);
          this.externalWalletType = walletData.type;
          this.account = new AptosAccount(Buffer.from(walletData.privateKey, "hex"));
          this.address = this.account.address().toString();
          this.isConnected = true;
          console.log('[WalletService] Successfully restored wallet:', { 
            address: this.address,
            type: this.externalWalletType 
          });
          this.notifyListeners();
        } catch (error) {
          console.error("[WalletService] Error restoring stored wallet:", error);
          localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
        }
      }
      
      console.log('[WalletService] Initialization complete');
    } catch (error) {
      console.error("[WalletService] Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Create a new wallet
   */
  async createWallet(): Promise<WalletInfo> {
    try {
      console.log('Creating new wallet...');
      this.account = new AptosAccount();
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = null;

      const walletInfo: WalletInfo = {
        address: this.address || '',
        privateKey: Buffer.from(this.account.signingKey.secretKey).toString("hex"),
        publicKey: Buffer.from(this.account.signingKey.publicKey).toString("hex"),
      };

      console.log('Wallet created successfully:', { address: this.address });
      this.notifyListeners();
      return walletInfo;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  /**
   * Import an existing wallet
   */
  async importWallet(privateKey: string): Promise<WalletInfo> {
    try {
      console.log('Importing wallet...');
      this.account = new AptosAccount(Buffer.from(privateKey, "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = null;

      const walletInfo: WalletInfo = {
        address: this.address || '',
        privateKey,
        publicKey: Buffer.from(this.account.signingKey.publicKey).toString("hex"),
      };

      console.log('Wallet imported successfully:', { address: this.address });
      this.notifyListeners();
      return walletInfo;
    } catch (error) {
      console.error("Error importing wallet:", error);
      throw error;
    }
  }

  /**
   * Connect to Web3Auth
   */
  async connectWeb3Auth(): Promise<boolean> {
    try {
      console.log('[WalletService] Starting Web3Auth connection...');
      const user = await web3AuthService.login();
      console.log('[WalletService] Web3Auth login response:', user ? 'Success' : 'Failed');
      
      if (!user) {
        throw new Error('Failed to get user data from Web3Auth');
      }

      console.log('[WalletService] Creating AptosAccount from private key...');
      this.account = new AptosAccount(Buffer.from(user.privKey.slice(2), "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = "web3auth";
      
      console.log('[WalletService] Web3Auth connection successful:', { 
        address: this.address,
        type: this.externalWalletType 
      });
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('[WalletService] Web3Auth connection failed:', error);
      this.isConnected = false;
      this.notifyListeners();
      return false;
    }
  }

  /**
   * Connect to Nightly wallet
   */
  async connectNightlyWallet(): Promise<boolean> {
    try {
      console.log('[WalletService] Checking for Nightly wallet...');
      
      if (typeof window === 'undefined' || !window.movement) {
        console.error('[WalletService] Nightly wallet not found');
        throw new Error("Nightly wallet is not installed");
      }

      console.log('[WalletService] Attempting to connect to Nightly wallet...');
      const response = await window.movement.connect();
      console.log('[WalletService] Nightly wallet connection response:', response ? 'Success' : 'Failed');
      
      if (!response) {
        console.error('[WalletService] Failed to connect to Nightly wallet');
        return false;
      }
      
      console.log('[WalletService] Creating AptosAccount for Nightly wallet...');
      this.account = new AptosAccount();
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = "nightly";

      console.log('[WalletService] Nightly wallet connected successfully:', { 
        address: this.address,
        type: this.externalWalletType 
      });

      localStorage.setItem(
        STORAGE_KEYS.EXTERNAL_WALLET,
        JSON.stringify({
          type: "nightly",
          address: this.address,
        })
      );

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error("[WalletService] Nightly wallet connection failed:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the wallet
   */
  async disconnect(): Promise<void> {
    try {
      console.log('Disconnecting wallet...');
      
      if (this.externalWalletType === "nightly" && window.movement) {
        try {
          await window.movement.disconnect();
        } catch (error) {
          console.error("Error disconnecting Nightly wallet:", error);
        }
      } else if (this.externalWalletType === "web3auth") {
        // Disconnect from Web3Auth
        await web3AuthService.logout();
      }

      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.externalWalletType = null;
      localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
      
      console.log('Wallet disconnected successfully');
      this.notifyListeners();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error;
    }
  }

  /**
   * Get the current account address
   */
  getWalletAddress(): string | null {
    return this.address;
  }

  /**
   * Get the current account
   */
  getAccount(): AptosAccount | null {
    return this.account;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the wallet type
   */
  getWalletType(): string | null {
    return this.externalWalletType;
  }

  /**
   * Add a listener for wallet state changes
   */
  addListener(listener: (state: any) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: (state: any) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const state = {
      address: this.address,
      isConnected: this.isConnected,
      walletType: this.externalWalletType,
    };
    this.listeners.forEach(listener => listener(state));
  }

  /**
   * Get user passes
   */
  async getUserPasses(address: string): Promise<any[]> {
    // This is a placeholder for the actual implementation
    return [];
  }
}

// Export a singleton instance
const walletService = new WalletService();
export default walletService; 