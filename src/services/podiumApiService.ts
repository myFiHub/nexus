import axios from 'axios';
import store from '../redux/store';
import { getEvmAddressFromPrivateKey } from './walletService';
import { ethers, verifyMessage } from 'ethers';

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
  // Step 2: Derive EVM and Aptos addresses
  const evmAddress = getEvmAddressFromPrivateKey(rawPrivateKey);
  const aptosAddress = address; // Already provided
  // Step 3: Sign the EVM address with the private key (EVM signature)
  const pk = rawPrivateKey.startsWith('0x') ? rawPrivateKey : '0x' + rawPrivateKey;
  const wallet = new ethers.Wallet(pk);
  const signature = await wallet.signMessage(evmAddress);
  // Debug: Verify the signature locally before sending
  const recovered = verifyMessage(evmAddress, signature);
  console.debug('[podiumApiService] Signature verification: Recovered:', recovered, 'Expected:', evmAddress);
  // Step 4: Build payload
  const payload = {
    username: evmAddress,
    signature,
    aptos_address: aptosAddress,
  };
  try {
    console.debug('[podiumApiService] loginWithAptosWallet payload:', payload);
    const res = await podiumApi.post('/auth/login', payload);
    console.debug('[podiumApiService] loginWithAptosWallet response:', res.data.data);
    return res.data.data;
  } catch (e) {
    console.error('[podiumApiService] loginWithAptosWallet error:', e);
    throw e;
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