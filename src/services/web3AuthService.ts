import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WEB3AUTH_NETWORK, WALLET_ADAPTERS } from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { AuthAdapter } from '@web3auth/auth-adapter';
import { Ed25519Account } from '@aptos-labs/ts-sdk';

// Print package versions for diagnostics
console.debug('[Web3AuthService] @web3auth/no-modal version: 9.7.0');
console.debug('[Web3AuthService] @web3auth/base version: 9.7.0');

// Web3AuthService: Handles Web3Auth v9 login and Movement (Aptos) account creation
// Singleton pattern for service instance
class Web3AuthService {
  private static instance: Web3AuthService;
  private web3auth: Web3AuthNoModal | null = null;
  private provider: SafeEventEmitterProvider | null = null;
  private _isInitialized: boolean = false;
  private _readyPromise: Promise<void>;
  private _resolveReady: (() => void) | null = null;

  private constructor() {
    console.debug('[Web3AuthService] Constructor called. Instance:', this);
    this._readyPromise = new Promise((resolve) => {
      this._resolveReady = resolve;
    });
  }

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService();
      console.debug('[Web3AuthService] Singleton instance created:', Web3AuthService.instance);
    } else {
      console.debug('[Web3AuthService] Singleton instance reused:', Web3AuthService.instance);
    }
    return Web3AuthService.instance;
  }

  public get isInitialized() {
    return this._isInitialized;
  }
  public get readyPromise() {
    return this._readyPromise;
  }

  // Initialize Web3AuthNoModal with CommonPrivateKeyProvider for Movement/Aptos
  public async init(clientId: string, movementRpcUrl: string, explorerUrl: string) {
    if (this.web3auth) {
      console.debug('[Web3AuthService] init() called but already initialized.');
      return;
    }
    console.debug('[Web3AuthService] Initializing Web3AuthNoModal...');
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.OTHER,
      chainId: '0x1',
      rpcTarget: movementRpcUrl,
      displayName: 'Movement',
      blockExplorerUrl: explorerUrl,
      ticker: 'MOV',
      tickerName: 'Movement',
    };
    const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });
    this.web3auth = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      privateKeyProvider,
      chainConfig,
    });
    // Configure the AuthAdapter for social login
    const authAdapter = new AuthAdapter();
    this.web3auth.configureAdapter(authAdapter);
    await this.web3auth.init();
    this._isInitialized = true;
    if (this._resolveReady) this._resolveReady();
    console.debug('[Web3AuthService] Web3AuthNoModal initialized. Instance:', this);
  }

  // Login and return Aptos/Movement account info
  public async login(loginProvider: 'google' | 'twitter' | 'email_passwordless'): Promise<{
    address: string;
    privateKey: string;
    aptosAccount: any;
  } | null> {
    if (!this.web3auth) throw new Error('Web3AuthNoModal not initialized');
    let connectedProvider: any = undefined;
    try {
      // loginProvider is required for no-modal SDK
      connectedProvider = await this.web3auth.connectTo(WALLET_ADAPTERS.AUTH, { loginProvider });
      if (!connectedProvider) {
        console.error('[Web3AuthService] Failed to connect to provider');
        return null;
      }
      this.provider = connectedProvider;
      console.debug('[Web3AuthService] User connected');
    } catch (error: any) {
      if (error?.message?.includes('Already connected')) {
        console.warn('[Web3AuthService] Already connected, fetching session info...');
        if (this.web3auth.provider) {
          this.provider = this.web3auth.provider;
        } else {
          console.error('[Web3AuthService] No provider found in existing session');
          return null;
        }
      } else {
        throw error;
      }
    }
    if (!this.provider) {
      console.error('[Web3AuthService] Provider is null, cannot get private key');
      return null;
    }
    // Get private key from provider
    const rawPrivateKey = await this.provider.request({ method: 'private_key' }) as string | undefined;
    if (!rawPrivateKey) {
      console.error('[Web3AuthService] Failed to get private key from provider');
      return null;
    }
    // Convert hex string to Uint8Array (32 bytes)
    const privateKeyUint8Array = new Uint8Array(
      rawPrivateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
    );
    const seed = privateKeyUint8Array.slice(0, 32);
    try {
      // Use Ed25519PrivateKey constructor with 32-byte Uint8Array seed
      const { Ed25519Account, Ed25519PrivateKey } = await import('@aptos-labs/ts-sdk');
      const ed25519PrivateKey = new Ed25519PrivateKey(seed);
      const aptosAccount = new Ed25519Account({ privateKey: ed25519PrivateKey });
      const address = aptosAccount.accountAddress.toString();
      if (!address || !aptosAccount) {
        console.error('[Web3AuthService] login: address or aptosAccount is null');
        return null;
      }
      return { address, privateKey: rawPrivateKey, aptosAccount };
    } catch (e) {
      console.error('[Web3AuthService] Failed to construct Ed25519Account:', e);
      return null;
    }
  }

  // Logout
  public async logout() {
    if (!this.web3auth) return;
    await this.web3auth.logout();
    this.provider = null;
    console.debug('[Web3AuthService] User logged out');
  }

  // Sign a message for authentication (Web3Auth + Aptos)
  public async signMessage(message: string): Promise<string> {
    if (!this.provider) {
      console.error('[Web3AuthService] signMessage: No provider set');
      throw new Error('No Web3Auth provider');
    }
    if (typeof this.provider.request !== 'function') {
      console.error('[Web3AuthService] signMessage: Provider does not support request method', this.provider);
      throw new Error('Web3Auth provider is not ready or does not support request. Please reconnect your wallet.');
    }
    // Step 1: Retrieve private key from provider
    let rawPrivateKey: string | undefined;
    try {
      rawPrivateKey = await this.provider.request({ method: 'private_key' }) as string | undefined;
      console.debug('[Web3AuthService] signMessage: Retrieved private key', rawPrivateKey);
    } catch (e) {
      console.error('[Web3AuthService] signMessage: Failed to get private key from provider', e);
      throw new Error('Failed to get private key from Web3Auth provider');
    }
    if (!rawPrivateKey) {
      throw new Error('Web3Auth provider did not return a private key');
    }
    // Step 2: Convert hex string to Uint8Array (32 bytes)
    let privateKeyUint8Array: Uint8Array;
    try {
      privateKeyUint8Array = new Uint8Array(
        rawPrivateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
      );
      console.debug('[Web3AuthService] signMessage: Converted private key to Uint8Array', privateKeyUint8Array);
    } catch (e) {
      console.error('[Web3AuthService] signMessage: Failed to convert private key to Uint8Array', e);
      throw new Error('Failed to convert private key to Uint8Array');
    }
    // Step 3: Construct Ed25519Account
    let aptosAccount: any;
    try {
      const { Ed25519Account, Ed25519PrivateKey } = await import('@aptos-labs/ts-sdk');
      const ed25519PrivateKey = new Ed25519PrivateKey(privateKeyUint8Array.slice(0, 32));
      aptosAccount = new Ed25519Account({ privateKey: ed25519PrivateKey });
      console.debug('[Web3AuthService] signMessage: Constructed Ed25519Account', aptosAccount);
    } catch (e) {
      console.error('[Web3AuthService] signMessage: Failed to construct Ed25519Account', e);
      throw new Error('Failed to construct Ed25519Account');
    }
    // Step 4: Sign the message using the Aptos SDK
    try {
      // The signMessage method may differ depending on SDK version
      // For @aptos-labs/ts-sdk, use signBuffer or signMessage
      const encoder = new TextEncoder();
      const messageBuffer = encoder.encode(message);
      const signature = aptosAccount.signBuffer(messageBuffer);
      console.debug('[Web3AuthService] signMessage: Signed message', signature);
      // Return as hex string
      return Buffer.from(signature).toString('hex');
    } catch (e) {
      console.error('[Web3AuthService] signMessage: Failed to sign message', e);
      throw new Error('Failed to sign message with Aptos account');
    }
  }
}

export default Web3AuthService.getInstance(); 