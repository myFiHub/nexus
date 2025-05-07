import web3AuthService from './web3authService';
import { AppDispatch } from '../redux/store';
import { startConnecting, setWallet, setError, disconnect } from '../redux/slices/walletSlice';
import { getAptosWallets, type NetworkInfo } from '@aptos-labs/wallet-standard';
import { Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk';

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

const MOVEMENT_RPC_URL = 'https://fullnode.mainnet.movementlabs.xyz/v1';

// WalletService: Handles wallet connection logic and Redux integration
const walletService = {
  async connectWallet(dispatch: AppDispatch, providerType: 'web3auth' | 'nightly') {
    dispatch(startConnecting());
    try {
      if (providerType === 'web3auth') {
        console.debug('[walletService] Attempting Web3Auth login...');
        const loginResult = await web3AuthService.login();
        console.debug('[walletService] Web3Auth login result:', loginResult);
        if (!loginResult) {
          console.error('[walletService] Web3Auth login failed: No result returned');
          throw new Error('Web3Auth login failed');
        }
        const { address, aptosAccount } = loginResult;
        const balance = await walletService.fetchBalance(address);
        dispatch(setWallet({ address, chainId: 1, balance }));
        console.debug('[walletService] Web3Auth wallet connected:', address, 'Balance:', balance);
        return { address, chainId: 1, balance };
      } else if (providerType === 'nightly') {
        console.debug('[walletService] Attempting Nightly Wallet connection...');
        const { aptosWallets } = getAptosWallets();
        const nightly = aptosWallets.find(w => (w as any).label.toLowerCase().includes('nightly'));
        if (!nightly) {
          console.error('[walletService] Nightly Wallet not detected.');
          throw new Error('Nightly Wallet not detected. Please install the Nightly Wallet extension.');
        }
        const networkInfo: NetworkInfo = {
          name: Network.MAINNET,
          chainId: 1,
          url: MOVEMENT_RPC_URL,
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
        dispatch(setWallet({ address, chainId: 1, balance }));
        console.debug('[walletService] Nightly Wallet connected:', address, 'Balance:', balance);
        return { address, chainId: 1, balance };
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
      const nightly = aptosWallets.find(w => (w as any).label.toLowerCase().includes('nightly'));
      if (nightly && (nightly as any).features['aptos:disconnect']) {
        await (nightly as any).features['aptos:disconnect'].disconnect();
        console.debug('[walletService] Nightly Wallet disconnected');
      }
      await web3AuthService.logout();
      dispatch(disconnect());
      console.debug('[walletService] Wallet disconnected');
    } catch (error: any) {
      dispatch(setError(error.message || 'Wallet disconnect failed'));
      console.error('[walletService] Wallet disconnect error:', error);
    }
  },

  async fetchBalance(address: string): Promise<string> {
    try {
      const config = new AptosConfig({ network: Network.MAINNET, fullnode: MOVEMENT_RPC_URL });
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
};

export default walletService; 