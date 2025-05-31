import axios from 'axios';
import store from '../redux/store';
import { getEvmAddressFromPrivateKey } from './walletService';
import ethereumService from './ethereumService';

// Use environment variable for backend API base URL (best practice)
const API_BASE = import.meta.env.VITE_PODIUM_BACKEND_BASE_URL || 'https://prod.podium.myfihub.com/api/v1';

// Axios instance for Podium API
export const podiumApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from Redux session to all requests
podiumApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.session?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login with wallet (get JWT)
/**
 * @param payload The login request payload (see LoginRequest structure)
 */
export async function loginWithWallet(payload: any) {
  try {
    console.debug('[podiumApiService] loginWithWallet payload:', payload);
    const res = await podiumApi.post('/auth/login', payload);
    console.debug('[podiumApiService] loginWithWallet response:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] loginWithWallet error:', e);
    throw e;
  }
}

// Login with Aptos wallet, using EVM-compatible address for authentication.
/**
 * @param address The user's Aptos address (Move address)
 * @param signature (deprecated, ignored)
 * @returns The login response (JWT, etc.)
 */
export async function loginWithAptosWallet(address: string, _signature: string, provider?: any) {
  // Step 1: Get the private key from the provider
  if (!provider || typeof provider.request !== 'function') {
    throw new Error('Web3Auth provider is required and must support request method');
  }
  const rawPrivateKey = await provider.request({ method: 'private_key' });
  if (!rawPrivateKey) {
    throw new Error('Failed to get private key from provider');
  }

  // Step 2: Create an Ethereum wallet and get the EVM address
  const wallet = ethereumService.createWallet(rawPrivateKey);
  const evmAddress = wallet.address;

  // Step 3: Sign the EVM address with the Ethereum wallet
  const signature = await ethereumService.signMessage(rawPrivateKey, evmAddress);

  // Step 4: Verify the signature locally before sending
  const recovered = ethereumService.verifySignature(evmAddress, signature);
  console.debug('[podiumApiService] Signature verification:', { recovered, expected: evmAddress });

  // Build the payload exactly as specified by the backend
  const payload = {
    username: evmAddress,
    signature: signature
  };
  console.debug(`[podiumApiService] loginWithAptosWallet payload:`, JSON.stringify(payload, null, 2));

  try {
    // Make the login request
    const response = await podiumApi.post('/auth/login', payload);
    console.debug(`[podiumApiService] Login response:`, JSON.stringify(response.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.error(`[podiumApiService] Login error details:`, {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
}

// Fetch all outposts
export async function fetchOutposts() {
  try {
    const res = await podiumApi.get('/outposts');
    console.debug('[podiumApiService] fetchOutposts:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchOutposts error:', e);
    throw e;
  }
}

// Fetch outpost detail by UUID
export async function fetchOutpostDetail(uuid: string) {
  try {
    const res = await podiumApi.get(`/outposts/detail?uuid=${uuid}`);
    console.debug('[podiumApiService] fetchOutpostDetail:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchOutpostDetail error:', e);
    throw e;
  }
}

// Fetch user detail by UUID
export async function fetchUserDetail(uuid: string) {
  try {
    const res = await podiumApi.get(`/users/detail?uuid=${uuid}`);
    console.debug('[podiumApiService] fetchUserDetail:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchUserDetail error:', e);
    throw e;
  }
}

// Fetch user by Aptos address
export async function fetchUserByAptosAddress(address: string) {
  try {
    const res = await podiumApi.get(`/users/detail/by-aptos-address`, { params: { aptos_address: address } });
    console.debug('[podiumApiService] fetchUserByAptosAddress:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchUserByAptosAddress error:', e);
    throw e;
  }
}

// Fetch user passes (authenticated)
export async function fetchUserPasses() {
  try {
    const res = await podiumApi.get('/podium-passes/my-passes');
    console.debug('[podiumApiService] fetchUserPasses:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchUserPasses error:', e);
    throw e;
  }
} 