import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTER_TYPE } from "@web3auth/base";
import { AptosAccount } from "aptos";
import { Buffer } from "buffer";
import { WEB3AUTH_CONFIG } from "../config/config";

export interface Web3AuthUser {
  privKey: string;
  ed25519PrivKey: string;
  userInfo: {
    email: string;
    name: string;
    profileImage: string;
    verifier: string;
    verifierId: string;
    typeOfLogin: string;
    aggregateVerifier: string;
  };
}

export interface Web3AuthConfig {
  clientId: string;
  chainConfig: {
    chainNamespace: string;
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
  };
  web3AuthNetwork: string;
  enableLogging: boolean;
}

export interface ProviderConfig {
  provider: WALLET_ADAPTER_TYPE;
  clientId: string;
  verifier: string;
}

class Web3AuthService {
  private web3auth: Web3Auth;
  private provider: any;
  private account: AptosAccount | null;
  private address: string | null;
  private isConnected: boolean;
  private listeners: ((state: any) => void)[];

  constructor() {
    this.web3auth = new Web3Auth({
      clientId: WEB3AUTH_CONFIG.CLIENT_ID as string,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.CHAIN_ID,
        rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.RPC_TARGET,
        displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.DISPLAY_NAME,
        blockExplorer: WEB3AUTH_CONFIG.CHAIN_CONFIG.BLOCK_EXPLORER,
        ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.TICKER,
        tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.TICKER_NAME,
      },
      web3AuthNetwork: "mainnet",
      enableLogging: true,
    });
    this.provider = null;
    this.account = null;
    this.address = null;
    this.isConnected = false;
    this.listeners = [];
  }

  /**
   * Initialize Web3Auth
   */
  async initialize(): Promise<void> {
    try {
      await this.web3auth.initModal();
      this.notifyListeners();
    } catch (error) {
      console.error("Error initializing Web3Auth:", error);
      throw error;
    }
  }

  /**
   * Login with a specific provider
   */
  async login(provider: WALLET_ADAPTER_TYPE): Promise<Web3AuthUser> {
    try {
      const web3authProvider = await this.web3auth.connectTo(provider);
      if (!web3authProvider) {
        throw new Error("Failed to connect to provider");
      }
      this.provider = web3authProvider;
      const userInfo = await this.web3auth.getUserInfo();
      const privateKey = await this.web3auth.provider?.request({
        method: "private_key"
      });
      if (!privateKey) {
        throw new Error("Failed to get private key");
      }
      const ed25519PrivKey = await this.web3auth.provider?.request({
        method: "ed25519_private_key"
      });
      if (!ed25519PrivKey) {
        throw new Error("Failed to get ed25519 private key");
      }
      this.account = new AptosAccount(Buffer.from(privateKey as string, "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      this.notifyListeners();
      return {
        privKey: privateKey as string,
        ed25519PrivKey: ed25519PrivKey as string,
        userInfo: {
          email: userInfo.email || "",
          name: userInfo.name || "",
          profileImage: userInfo.profileImage || "",
          verifier: userInfo.verifier || "",
          verifierId: userInfo.verifierId || "",
          typeOfLogin: userInfo.typeOfLogin || "",
          aggregateVerifier: userInfo.aggregateVerifier || ""
        }
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Logout from Web3Auth
   */
  async logout(): Promise<void> {
    try {
      await this.web3auth.logout();
      this.provider = null;
      this.account = null;
      this.address = null;
      this.isConnected = false;
      this.notifyListeners();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  /**
   * Get current user information
   */
  async getUserInfo(): Promise<Web3AuthUser | null> {
    if (!this.isConnected) {
      return null;
    }

    try {
      const userInfo = await this.web3auth.getUserInfo();
      const privateKey = await this.provider.request({ method: "private_key" });

      return {
        privKey: privateKey,
        ed25519PrivKey: privateKey,
        userInfo: userInfo as any,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  /**
   * Get the current account
   */
  getAccount(): AptosAccount | null {
    return this.account;
  }

  /**
   * Get the current address
   */
  getAddress(): string | null {
    return this.address;
  }

  /**
   * Check if connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
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
      provider: this.provider,
    };
    this.listeners.forEach(listener => listener(state));
  }
}

export default new Web3AuthService(); 