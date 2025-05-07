import axios from 'axios';

// Podium backend API base URL
const API_BASE = 'https://prod.podium.myfihub.com/api/v1';

// Axios instance for Podium API
export const podiumApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

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