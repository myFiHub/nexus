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
      console.log('Initializing wallet service...');
      
      // Initialize Web3Auth
      await web3AuthService.initialize();

      // Check if there's a stored external wallet
      const storedWallet = localStorage.getItem(STORAGE_KEYS.EXTERNAL_WALLET);
      if (storedWallet) {
        try {
          console.log('Found stored wallet, attempting to restore...');
          const walletData = JSON.parse(storedWallet);
          this.externalWalletType = walletData.type;
          this.account = new AptosAccount(Buffer.from(walletData.privateKey, "hex"));
          this.address = this.account.address().toString();
          this.isConnected = true;
          console.log('Successfully restored wallet:', { address: this.address });
          this.notifyListeners();
        } catch (error) {
          console.error("Error initializing external wallet:", error);
          localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
        }
      }
    } catch (error) {
      console.error("Error initializing wallet service:", error);
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
        address: this.address,
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
        address: this.address,
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
      console.log('Connecting to Web3Auth...');
      const user = await web3AuthService.login();
      if (!user) {
        throw new Error('Failed to get user data from Web3Auth');
      }

      this.account = new AptosAccount(Buffer.from(user.privKey.slice(2), "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = "web3auth";
      
      console.log('Web3Auth connected successfully:', { address: this.address });
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to connect Web3Auth:', error);
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
      console.log('Checking for Nightly wallet...');
      
      // Check if Nightly wallet is available
      if (typeof window === 'undefined' || !window.movement) {
        console.error('Nightly wallet is not installed');
        throw new Error("Nightly wallet is not installed");
      }

      console.log('Connecting to Nightly wallet...');
      const response = await window.movement.connect();
      
      if (!response) {
        console.error('Failed to connect to Nightly wallet');
        return false;
      }
      
      console.log('Nightly wallet connected, getting address...');
      
      // For Nightly wallet, we'll create a new account for now
      // In a production environment, you would get the actual address from the wallet
      this.account = new AptosAccount();
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = "nightly";

      console.log('Nightly wallet connected successfully:', { address: this.address });

      // Store the wallet data
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
      console.error("Error connecting to Nightly wallet:", error);
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
   * Get the current wallet address
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
   * Check if the wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the type of wallet connection
   */
  getWalletType(): string | null {
    if (this.externalWalletType) {
      return this.externalWalletType;
    } else if (this.isConnected) {
      return "web3auth";
    }
    return null;
  }

  /**
   * Add a listener for state changes
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
      walletType: this.externalWalletType,
      isConnected: this.isConnected,
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