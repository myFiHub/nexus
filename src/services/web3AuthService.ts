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
  public async login(): Promise<{
    address: string;
    privateKey: string;
    aptosAccount: Ed25519Account;
  } | null> {
    if (!this.web3auth) throw new Error('Web3AuthNoModal not initialized');
    // Use connectTo with WALLET_ADAPTERS.AUTH for social login
    const provider = await this.web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: 'google', // You can make this dynamic if needed
    });
    this.provider = provider;
    console.debug('[Web3AuthService] User connected');

    // Get private key from Web3Auth provider
    const privateKey: string = await provider.request({ method: 'private_key' });
    console.debug('[Web3AuthService] Private key extracted');

    // Convert hex string to Uint8Array
    const privateKeyUint8Array = new Uint8Array(
      privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
    );
    // Create Aptos/Movement account using Ed25519Account (use only first 32 bytes as seed)
    const aptosAccount = new Ed25519Account({ privateKey: privateKeyUint8Array.slice(0, 32) });
    const address = aptosAccount.accountAddress.toString();
    console.debug('[Web3AuthService] Aptos/Movement account created:', address);

    return { address, privateKey, aptosAccount };
  }

  // Logout
  public async logout() {
    if (!this.web3auth) return;
    await this.web3auth.logout();
    this.provider = null;
    console.debug('[Web3AuthService] User logged out');
  }
}

export default Web3AuthService.getInstance(); 