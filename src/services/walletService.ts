import web3AuthService from './web3AuthService';
import { AppDispatch } from '../redux/store';
import { startConnecting, setWallet, setError, disconnect } from '../redux/slices/walletSlice';
import { getAptosWallets, type NetworkInfo } from '@aptos-labs/wallet-standard';
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk';
import { APTOS_NODE_URL } from '../config/config';
import { ethers } from 'ethers';
import { loginWithAptosWallet } from './podiumApiService';
import { setToken, setLoading as setSessionLoading, setError as setSessionError } from '../redux/slices/sessionSlice';

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

// WalletService: Handles wallet connection logic and Redux integration
const walletService = {
  async connectWallet(dispatch: AppDispatch, providerType: 'web3auth' | 'nightly', loginProvider?: 'google' | 'twitter' | 'email_passwordless') {
    dispatch(startConnecting());
    // Debug printout for endpoint
    console.debug('[walletService] Using APTOS_NODE_URL:', APTOS_NODE_URL);
    try {
      if (providerType === 'web3auth') {
        if (!loginProvider) throw new Error('loginProvider is required for Web3Auth');
        let loginResult: any = null;
        try {
          loginResult = await web3AuthService.login(loginProvider);
        } catch (error: any) {
          if (error?.message?.includes('Already connected')) {
            console.warn('[walletService] Already connected error, syncing session...');
            loginResult = await walletService.syncWeb3AuthSession();
          } else {
            throw error;
          }
        }
        console.debug('[walletService] Web3Auth login result:', loginResult);
        if (!loginResult) {
          console.error('[walletService] Web3Auth login failed: No result returned');
          throw new Error('Web3Auth login failed');
        }
        const { address, aptosAccount } = loginResult;
        const provider = (web3AuthService as any).provider || null;
        const balance = await walletService.fetchBalance(address);
        dispatch(setWallet({ address, chainId: 1, balance, walletType: 'web3auth', provider }));
        // Persist wallet state in localStorage
        localStorage.setItem('wallet', JSON.stringify({ address, chainId: 1, balance, walletType: 'web3auth' }));
        console.debug('[walletService] Wallet state persisted to localStorage:', { address, chainId: 1, balance, walletType: 'web3auth' });
        console.debug('[walletService] Web3Auth wallet connected:', address, 'Balance:', balance);
        return { address, chainId: 1, balance, walletType: 'web3auth', provider };
      } else if (providerType === 'nightly') {
        console.debug('[walletService] Attempting Nightly Wallet connection...');
        const { aptosWallets } = getAptosWallets();
        const nightly = aptosWallets.find(
          w => w && typeof (w as any).label === 'string' && (w as any).label.toLowerCase().includes('nightly')
        );
        if (!nightly) {
          console.error('[walletService] Nightly Wallet not detected.');
          throw new Error('Nightly Wallet not detected. Please install the Nightly Wallet extension.');
        }
        const networkInfo: NetworkInfo = {
          name: Network.MAINNET,
          chainId: 1,
          url: APTOS_NODE_URL,
        };
        console.debug('[walletService] Connecting to Nightly Wallet with networkInfo:', networkInfo);
        await (nightly as any).features['aptos:connect'].connect(false, networkInfo);
        const account = (nightly as any).accounts[0];
        if (!account) {
          console.error('[walletService] No account found in Nightly Wallet after connection.');
          throw new Error('No account found in Nightly Wallet after connection.');
        }
        const address = account.address;
        const balance = await walletService.fetchBalance(address);
        dispatch(setWallet({ address, chainId: 1, balance, walletType: 'nightly', provider: nightly }));
        // Persist wallet state in localStorage
        localStorage.setItem('wallet', JSON.stringify({ address, chainId: 1, balance, walletType: 'nightly' }));
        console.debug('[walletService] Wallet state persisted to localStorage:', { address, chainId: 1, balance, walletType: 'nightly' });
        console.debug('[walletService] Nightly Wallet connected:', address, 'Balance:', balance);
        return { address, chainId: 1, balance, walletType: 'nightly', provider: nightly };
      }
    } catch (error: any) {
      dispatch(setError(error.message || 'Wallet connection failed'));
      console.error('[walletService] Wallet connection error:', error, error?.stack);
      throw error;
    }
  },

  async disconnectWallet(dispatch: AppDispatch) {
    try {
      // Attempt to disconnect Nightly if connected
      const { aptosWallets } = getAptosWallets();
      // TypeScript: Cast to 'any' to access label/features/accounts due to upstream type limitations
      const nightly = aptosWallets.find(
        w => w && typeof (w as any).label === 'string' && (w as any).label.toLowerCase().includes('nightly')
      );
      if (nightly && (nightly as any).features['aptos:disconnect']) {
        await (nightly as any).features['aptos:disconnect'].disconnect();
        console.debug('[walletService] Nightly Wallet disconnected');
      }
      await web3AuthService.logout();
      dispatch(disconnect());
      // Remove wallet state from localStorage
      localStorage.removeItem('wallet');
      console.debug('[walletService] Wallet state removed from localStorage');
      console.debug('[walletService] Wallet disconnected');
    } catch (error: any) {
      dispatch(setError(error.message || 'Wallet disconnect failed'));
      console.error('[walletService] Wallet disconnect error:', error);
    }
  },

  async fetchBalance(address: string): Promise<string> {
    try {
      const config = new AptosConfig({ network: Network.MAINNET, fullnode: APTOS_NODE_URL });
      const aptos = new Aptos(config);
      const resources = await aptos.account.getAccountResources({ accountAddress: address });
      const coinResource = resources.find((r: any) => r.type.includes('0x1::coin::CoinStore'));
      let balance = '0';
      // TypeScript: Use 'as any' to bypass type checking for dynamic resource structure
      const value = (coinResource as any)?.data?.coin?.value;
      if (typeof value === 'string') {
        balance = value;
      }
      console.debug('[walletService] Fetched balance for', address, ':', balance);
      return balance;
    } catch (error) {
      console.error('[walletService] Error fetching balance:', error);
      return '0';
    }
  },

  async getWalletInfo() {
    return null;
  },

  // Sync Redux state with existing Web3Auth session
  async syncWeb3AuthSession(): Promise<{ provider: any } | null> {
    // Only check for provider, do not attempt to fetch private key
    if (!web3AuthService || !web3AuthService['web3auth'] || !web3AuthService['web3auth'].provider) {
      console.warn('[walletService] No Web3Auth session to sync');
      return null;
    }
    const provider = web3AuthService['web3auth'].provider;
    if (provider) {
      // Optionally, you could try to get the address from the provider if needed
      return { provider };
    }
    return null;
  },

  // Sync Redux state with any existing wallet session (Web3Auth or Nightly)
  async syncWalletSession(dispatch: AppDispatch) {
    // Try Web3Auth session first
    const web3AuthSession = await walletService.syncWeb3AuthSession();
    if (web3AuthSession && web3AuthSession.provider) {
      // Ensure the singleton is in sync after reload
      if (web3AuthService && typeof web3AuthService === 'object') {
        (web3AuthService as any).provider = web3AuthSession.provider;
      }
      // If provider is available, update Redux (address is already in state)
      dispatch(setWallet({
        ...JSON.parse(localStorage.getItem('wallet') || '{}'),
        provider: web3AuthSession.provider
      }));
      console.debug('[walletService] Synced Web3Auth provider');
      return;
    }
    // TODO: Add Nightly session sync if needed
  },

  /**
   * Sign a message for authentication (Web3Auth or Nightly)
   * @param address Wallet address
   * @param message Message to sign
   * @param walletType Type of wallet (web3auth, nightly, etc.)
   * @param provider Wallet provider object
   * @returns signature (hex/base64)
   */
  async signMessage(address: string, message: string, walletType: string, provider: any): Promise<string> {
    if (!walletType) throw new Error('No wallet type specified. Please reconnect your wallet.');
    if (!provider) throw new Error('No wallet provider found. Please reconnect your wallet.');
    if (walletType === 'web3auth') {
      if (web3AuthService && typeof web3AuthService.signMessage === 'function') {
        try {
          const sig = await web3AuthService.signMessage(message);
          console.debug('[walletService] Web3Auth signMessage success');
          return sig;
        } catch (err) {
          console.error('[walletService] Web3Auth signMessage error:', err);
          throw err;
        }
      } else {
        throw new Error('Web3Auth signMessage not available.');
      }
    } else if (walletType === 'nightly') {
      if (provider && provider.features && provider.features['aptos:signMessage']) {
        try {
          const result = await provider.features['aptos:signMessage'].signMessage({
            address,
            message,
          });
          console.debug('[walletService] Nightly signMessage success');
          return result.signature;
        } catch (e) {
          console.error('[walletService] Nightly signMessage error:', e);
          throw e;
        }
      } else {
        throw new Error('Nightly Wallet signMessage not available.');
      }
    }
    throw new Error('Unsupported wallet type for signMessage.');
  },
};

/**
 * Derives the EVM-compatible address from a hex private key.
 * @param privateKey The private key as a hex string (with or without 0x prefix)
 * @returns The EVM-compatible address (0x...)
 */
export function getEvmAddressFromPrivateKey(privateKey: string): string {
  // Ensure the private key has 0x prefix
  const pk = privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
  const wallet = new ethers.Wallet(pk);
  return wallet.address;
}

/**
 * Centralized login flow for Web3Auth + Aptos: gets private key, derives addresses, signs, and authenticates.
 * @param dispatch Redux dispatch
 * @param provider Web3Auth provider object
 * @param aptosAddress The user's Aptos address (Move address)
 * @returns The login response (JWT, etc.)
 */
export async function loginWithWeb3AuthAndAptos(dispatch: any, provider: any, aptosAddress: string) {
  dispatch(setSessionLoading(true));
  try {
    console.debug('[walletService] loginWithWeb3AuthAndAptos: Starting login flow', { aptosAddress, provider });
    const result = await loginWithAptosWallet(aptosAddress, '', provider);
    console.debug('[walletService] loginWithWeb3AuthAndAptos: loginWithAptosWallet result', result);
    if (result && result.token) {
      dispatch(setToken(result.token));
    } else {
      dispatch(setSessionError('Login failed: No token returned'));
    }
    return result;
  } catch (e: any) {
    console.error('[walletService] loginWithWeb3AuthAndAptos error:', e);
    const errorMsg = (e && typeof e.message === 'string' && e.message) ? e.message : 'Login failed. Please reconnect your wallet.';
    dispatch(setSessionError(errorMsg));
    throw e;
  } finally {
    dispatch(setSessionLoading(false));
  }
}

export default walletService; 