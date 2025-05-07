import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { Ed25519Account } from '@aptos-labs/ts-sdk';

// Web3AuthService: Handles Web3Auth v9 login and Movement (Aptos) account creation
// Singleton pattern for service instance
class Web3AuthService {
  private static instance: Web3AuthService;
  private web3auth: Web3Auth | null = null;
  private provider: SafeEventEmitterProvider | null = null;

  private constructor() {}

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService();
    }
    return Web3AuthService.instance;
  }

  // Initialize Web3Auth modal
  public async init(clientId: string, movementRpcUrl: string, explorerUrl: string) {
    if (this.web3auth) return;
    // @ts-ignore
    // TypeScript may complain about missing privateKeyProvider, but for non-EVM chains (Aptos/Movement),
    // the official Web3Auth docs show this is correct: https://web3auth.io/docs/connect-blockchain/other/aptos
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: '0x1', // Use '0x1' for mainnet, or Movement's chainId if different
        rpcTarget: movementRpcUrl,
        displayName: 'Movement',
        blockExplorerUrl: explorerUrl,
        ticker: 'MOV',
        tickerName: 'Movement',
      },
      web3AuthNetwork: 'sapphire_mainnet',
    });
    await this.web3auth.initModal();
    console.debug('[Web3AuthService] Web3Auth modal initialized');
  }

  // Login and return Aptos/Movement account info
  public async login(): Promise<{
    address: string;
    privateKey: string;
    aptosAccount: Ed25519Account;
  } | null> {
    if (!this.web3auth) throw new Error('Web3Auth not initialized');
    const provider = await this.web3auth.connect();
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