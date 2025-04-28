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
      // Initialize Web3Auth
      await web3AuthService.initialize();

      // Check if there's a stored external wallet
      const storedWallet = localStorage.getItem(STORAGE_KEYS.EXTERNAL_WALLET);
      if (storedWallet) {
        try {
          const walletData = JSON.parse(storedWallet);
          this.externalWalletType = walletData.type;
          this.account = new AptosAccount(Buffer.from(walletData.privateKey, "hex"));
          this.address = this.account.address().toString();
          this.isConnected = true;
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
      this.account = new AptosAccount();
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = null;

      const walletInfo: WalletInfo = {
        address: this.address,
        privateKey: Buffer.from(this.account.signingKey.secretKey).toString("hex"),
        publicKey: Buffer.from(this.account.signingKey.publicKey).toString("hex"),
      };

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
      this.account = new AptosAccount(Buffer.from(privateKey, "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.externalWalletType = null;

      const walletInfo: WalletInfo = {
        address: this.address,
        privateKey,
        publicKey: Buffer.from(this.account.signingKey.publicKey).toString("hex"),
      };

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
      const user = await web3AuthService.login("google");
      if (user) {
        this.account = new AptosAccount(Buffer.from(user.privKey, "hex"));
        this.address = this.account.address().toString();
        this.isConnected = true;
        this.externalWalletType = null;
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error connecting to Web3Auth:", error);
      throw error;
    }
  }

  /**
   * Connect to Nightly wallet
   */
  async connectNightlyWallet(): Promise<boolean> {
    try {
      if (!window.movement) {
        throw new Error("Nightly wallet is not installed");
      }

      const response = await window.movement.connect();
      if (response) {
        this.account = new AptosAccount();
        this.address = this.account.address().toString();
        this.isConnected = true;
        this.externalWalletType = "nightly";

        // Store the wallet data
        localStorage.setItem(
          STORAGE_KEYS.EXTERNAL_WALLET,
          JSON.stringify({
            type: "nightly",
            privateKey: Buffer.from(this.account.signingKey.secretKey).toString("hex"),
          })
        );

        this.notifyListeners();
        return true;
      }
      return false;
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
      if (this.externalWalletType) {
        // Disconnect from external wallet
        this.account = null;
        this.address = null;
        this.isConnected = false;
        this.externalWalletType = null;
        localStorage.removeItem(STORAGE_KEYS.EXTERNAL_WALLET);
      } else {
        // Disconnect from Web3Auth
        await web3AuthService.logout();
      }

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
      isConnected: this.isConnected,
      address: this.address,
      account: this.account,
      walletType: this.getWalletType(),
    };
    this.listeners.forEach(listener => listener(state));
  }

  /**
   * Get user passes for a given address
   * @param address The wallet address to get passes for
   * @returns Array of user passes
   */
  async getUserPasses(address: string): Promise<any[]> {
    try {
      // This is a placeholder implementation
      // In a real application, this would fetch from a blockchain or API
      console.log(`Fetching passes for address: ${address}`);
      
      // Return empty array for now
      return [];
    } catch (error) {
      console.error('Error fetching user passes:', error);
      throw error;
    }
  }
}

export default new WalletService(); 