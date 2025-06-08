import axios from 'axios';
import store from '../redux/store';
import { getEvmAddressFromPrivateKey } from './walletService';
import ethereumService from './ethereumService';

// Use environment variable for backend API base URL (best practice)
const API_BASE = import.meta.env.VITE_PODIUM_BACKEND_BASE_URL;

console.log('[podiumApiService] API_BASE:', API_BASE);

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
  try {
    // Step 1: Get the private key from the provider
    if (!provider || typeof provider.request !== 'function') {
      throw new Error('Web3Auth provider is required and must support request method');
    }
    const rawPrivateKey = await provider.request({ method: 'private_key' });
    if (!rawPrivateKey) {
      throw new Error('Failed to get private key from provider');
    }

    // Step 2: Generate EVM address from the private key
    const evmAddress = ethereumService.getAddressFromPrivateKey(rawPrivateKey);
    console.debug('[podiumApiService] Generated EVM address:', evmAddress);

    // Step 3: Sign the EVM address as the message (with 0x prefix to match backend address.as_str())
    const messageToSign = evmAddress.toUpperCase(); // Keep 0x prefix and make uppercase
    const signature = await ethereumService.signMessage(rawPrivateKey, messageToSign);
    console.debug('[podiumApiService] Generated signature:', signature);

    // Step 4: Verify signature locally first
    const verification = await ethereumService.verifySignature(messageToSign, signature);
    console.debug('[podiumApiService] Signature verification:', verification);

    if (!verification.isValid) {
      throw new Error('Local signature verification failed');
    }

    // Step 5: Construct payload - username must match exactly what we signed
    const payload = {
      username: messageToSign, // Same string we signed (with 0x prefix, uppercase)
      signature: signature
    };
    console.debug('[podiumApiService] loginWithAptosWallet payload:', payload);

    // Step 6: Send login request
    console.debug('[podiumApiService] Sending login request to:', `${API_BASE}/auth/login`);
    const response = await axios.post(`${API_BASE}/auth/login`, payload);
    debugApiResponse('login', response.data);

    return response.data;
  } catch (error: any) {
    console.error('[podiumApiService] Login error details:', error.response || error);
    throw error;
  }
}

// Debug utility to inspect API responses
const debugApiResponse = (endpoint: string, data: any) => {
  console.debug(`[podiumApiService] ${endpoint} response structure:`, {
    fields: Object.keys(data),
    sample: data[0] || data,
    full: data
  });
};

// Fetch all outposts
export async function fetchOutposts() {
  try {
    const res = await podiumApi.get('/outposts');
    debugApiResponse('fetchOutposts', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchOutposts error:', e);
    throw e;
  }
}

// Fetch outpost detail by UUID
export async function fetchOutpostDetail(uuid: string) {
  try {
    const res = await podiumApi.get(`/outposts/${uuid}`);
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
    const res = await podiumApi.get(`/users/${uuid}`);
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
    const res = await podiumApi.get(`/users/by-aptos-address/${address}`);
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
    const res = await podiumApi.get('/users/passes');
    debugApiResponse('fetchUserPasses', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] fetchUserPasses error:', e);
    throw e;
  }
} 