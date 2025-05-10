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

  private constructor() {}

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService();
    }
    return Web3AuthService.instance;
  }

  // Initialize Web3AuthNoModal with CommonPrivateKeyProvider for Movement/Aptos
  public async init(clientId: string, movementRpcUrl: string, explorerUrl: string) {
    if (this.web3auth) return;
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
    console.debug('[Web3AuthService] Web3AuthNoModal initialized');
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

  // Sign a message for authentication (Web3Auth)
  public async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('No Web3Auth provider');
    const result = await this.provider.request({
      method: 'aptos_signMessage',
      params: [{ message }],
    }) as { signature?: string };
    if (!result || typeof result.signature !== 'string') throw new Error('Web3Auth: signMessage failed');
    return result.signature;
  }
}

export default Web3AuthService.getInstance(); 