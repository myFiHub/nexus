import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AptosAccount } from "aptos";
import { Buffer } from "buffer";
import { WEB3AUTH_CONFIG } from "../config/config";
import { AuthAdapter } from "@web3auth/auth-adapter";

export interface Web3AuthUser {
  privKey: string;
  ed25519PrivKey: string;
  name?: string;
  email?: string;
  profileImage?: string;
  provider?: string;
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
    wsTarget?: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
    logo?: string;
    decimals?: number;
    isTestnet?: boolean;
  };
  web3AuthNetwork: string;
  enableLogging: boolean;
  sessionTime?: number;
  storageKey?: string;
  mfaSettings?: {
    deviceShareFactor?: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    backUpShareFactor?: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    socialBackupFactor?: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
    passwordFactor?: {
      enable: boolean;
      priority: number;
      mandatory: boolean;
    };
  };
}

export interface ProviderConfig {
  provider: typeof WALLET_ADAPTERS[keyof typeof WALLET_ADAPTERS];
  clientId: string;
  verifier: string;
}

export interface Web3AuthState {
  isConnected: boolean;
  address: string | null;
  account: AptosAccount | null;
  provider: any;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  error: Error | null;
}

class Web3AuthService {
  private web3auth: Web3Auth;
  private provider: any;
  private account: AptosAccount | null;
  private address: string | null;
  private isConnected: boolean;
  private isInitializing: boolean;
  private isLoggingIn: boolean;
  private isLoggingOut: boolean;
  private error: Error | null;
  private listeners: ((state: Web3AuthState) => void)[];

  constructor() {
    if (!WEB3AUTH_CONFIG.CLIENT_ID) {
      console.error('Web3Auth client ID is not set. Please check your environment variables.');
      throw new Error('Web3Auth client ID is not set');
    }

    console.log('Initializing Web3Auth with config:', {
      clientId: WEB3AUTH_CONFIG.CLIENT_ID,
      chainConfig: WEB3AUTH_CONFIG.CHAIN_CONFIG,
      web3AuthNetwork: WEB3AUTH_CONFIG.WEB3AUTH_NETWORK,
      enableLogging: WEB3AUTH_CONFIG.ENABLE_LOGGING || false,
    });

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.chainId,
          rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.rpcTarget,
          displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.displayName,
          blockExplorerUrl: WEB3AUTH_CONFIG.CHAIN_CONFIG.blockExplorer,
          ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.ticker,
          tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.tickerName,
        }
      }
    });

    const web3AuthOptions = {
      clientId: WEB3AUTH_CONFIG.CLIENT_ID,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: WEB3AUTH_CONFIG.CHAIN_CONFIG.chainId,
        rpcTarget: WEB3AUTH_CONFIG.CHAIN_CONFIG.rpcTarget,
        displayName: WEB3AUTH_CONFIG.CHAIN_CONFIG.displayName,
        blockExplorerUrl: WEB3AUTH_CONFIG.CHAIN_CONFIG.blockExplorer,
        ticker: WEB3AUTH_CONFIG.CHAIN_CONFIG.ticker,
        tickerName: WEB3AUTH_CONFIG.CHAIN_CONFIG.tickerName,
      },
      web3AuthNetwork: 'mainnet' as any,
      enableLogging: true,
      sessionTime: 86400,
      storageKey: 'local' as 'local',
      uiConfig: {
        appName: "FiHub",
        loginMethodsOrder: ["google", "facebook", "twitter"],
      },
      privateKeyProvider,
    };

    this.web3auth = new Web3Auth(web3AuthOptions);
    const authAdapter = new AuthAdapter({ privateKeyProvider });
    this.web3auth.configureAdapter(authAdapter);
    this.provider = null;
    this.account = null;
    this.address = null;
    this.isConnected = false;
    this.isInitializing = false;
    this.isLoggingIn = false;
    this.isLoggingOut = false;
    this.error = null;
    this.listeners = [];
  }

  /**
   * Initialize Web3Auth
   */
  async initialize(): Promise<void> {
    try {
      this.isInitializing = true;
      this.error = null;
      this.notifyListeners();

      console.log('Starting Web3Auth initialization...');
      console.log('Web3Auth config:', {
        clientId: process.env.REACT_APP_WEB3_AUTH_CLIENT_ID,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.REACT_APP_INITIAL_EXTERNAL_WALLET_CHAIN_ID,
          rpcTarget: process.env.REACT_APP_RPC_TARGET,
          displayName: process.env.REACT_APP_CHAIN_DISPLAY_NAME,
          blockExplorerUrl: process.env.REACT_APP_BLOCK_EXPLORER,
          ticker: process.env.REACT_APP_CHAIN_TICKER,
          tickerName: process.env.REACT_APP_CHAIN_TICKER_NAME
        }
      });

      await this.web3auth.initModal();
      console.log('Web3Auth initialized successfully');
      
      this.isInitializing = false;
      this.notifyListeners();
    } catch (error) {
      this.isInitializing = false;
      this.error = error instanceof Error ? error : new Error('Failed to initialize Web3Auth');
      console.error('Web3Auth initialization error:', {
        message: this.error.message,
        stack: this.error.stack,
        error
      });
      this.notifyListeners();
      throw this.error;
    }
  }

  /**
   * Login with a specific provider
   */
  async login(provider: string = "google"): Promise<Web3AuthUser | null> {
    try {
      console.log('Starting Web3Auth login with provider:', provider);
      this.isLoggingIn = true;
      this.error = null;
      this.notifyListeners();

      console.log('Attempting to connect with Web3Auth...');
      const response = await this.web3auth.connect();
      console.log('Web3Auth connect response:', response);

      if (!response) {
        throw new Error('No response from Web3Auth connect');
      }

      this.provider = this.web3auth.provider;
      if (!this.provider) {
        throw new Error('No provider available after connection');
      }

      console.log('Requesting private key from provider...');
      const privateKey = await this.provider.request({
        method: "private_key"
      });
      console.log('Private key received:', privateKey ? 'Yes' : 'No');

      if (!privateKey) {
        throw new Error('No private key received from provider');
      }

      console.log('Getting user info...');
      const userInfo = await this.web3auth.getUserInfo();
      console.log('User info received:', userInfo);
      
      const user: Web3AuthUser = {
        privKey: privateKey,
        ed25519PrivKey: privateKey,
        userInfo: userInfo as any,
      };

      console.log('Creating AptosAccount from private key...');
      this.account = new AptosAccount(Buffer.from(privateKey.slice(2), "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      
      console.log('Web3Auth login successful:', {
        address: this.address,
        userInfo
      });

      this.isLoggingIn = false;
      this.notifyListeners();
      return user;
    } catch (error) {
      this.isLoggingIn = false;
      this.error = error instanceof Error ? error : new Error('Failed to login with Web3Auth');
      console.error('Web3Auth login error:', {
        message: this.error.message,
        stack: this.error.stack,
        error
      });
      this.notifyListeners();
      throw this.error;
    }
  }

  /**
   * Logout from Web3Auth
   */
  async logout(): Promise<void> {
    try {
      this.isLoggingOut = true;
      this.error = null;
      this.notifyListeners();

      await this.web3auth.logout();
      
      this.provider = null;
      this.account = null;
      this.address = null;
      this.isConnected = false;
      
      console.log('Web3Auth logout successful');

      this.isLoggingOut = false;
      this.notifyListeners();
    } catch (error) {
      this.isLoggingOut = false;
      this.error = error instanceof Error ? error : new Error('Failed to logout from Web3Auth');
      console.error('Web3Auth logout error:', {
        message: this.error.message,
        stack: this.error.stack
      });
      this.notifyListeners();
      throw this.error;
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(): Promise<Web3AuthUser | null> {
    try {
      if (!this.web3auth) {
        throw new Error('Web3Auth not initialized');
      }

      const userInfo = await this.web3auth.getUserInfo();
      if (!userInfo) {
        return null;
      }

      return {
        privKey: '',
        ed25519PrivKey: '',
        userInfo: userInfo as any,
      };
    } catch (error) {
      console.error('Error getting user info:', error);
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
   * Check if the wallet is connected
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the current state
   */
  private getState(): Web3AuthState {
    return {
      isConnected: this.isConnected,
      address: this.address,
      account: this.account,
      provider: this.provider,
      isInitializing: this.isInitializing,
      isLoggingIn: this.isLoggingIn,
      isLoggingOut: this.isLoggingOut,
      error: this.error,
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  /**
   * Add a listener for state changes
   */
  addListener(listener: (state: Web3AuthState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: (state: Web3AuthState) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Recover session from storage
   */
  async recoverSession(): Promise<boolean> {
    try {
      if (!this.web3auth) {
        return false;
      }

      // Check if already connected
      const userInfo = await this.web3auth.getUserInfo();
      if (!userInfo) {
        return false;
      }

      this.provider = this.web3auth.provider;
      if (!this.provider) {
        return false;
      }

      const privateKey = await this.provider.request({
        method: "private_key"
      });

      if (!privateKey) {
        return false;
      }

      this.account = new AptosAccount(Buffer.from(privateKey.slice(2), "hex"));
      this.address = this.account.address().toString();
      this.isConnected = true;
      
      console.log('Session recovered successfully:', {
        address: this.address
      });

      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error recovering session:', error);
      return false;
    }
  }
}

// Export a singleton instance
const web3AuthService = new Web3AuthService();
export default web3AuthService; 