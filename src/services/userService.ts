import { apiClient } from '../config/api.config';

export interface UserProfile {
    name?: string;
    image?: string;
    // Add other profile fields as needed
}

export interface UserSearchParams {
    page?: number;
    page_size?: number;
    text?: string;
}

export interface FollowersParams {
    page?: number;
    page_size?: number;
}

// userService: Handles user profile, portfolio, and transaction history
// Add methods for fetching/updating user data

const userService = {
    // Update user profile
    updateProfile: async (profileData: UserProfile) => {
        const response = await apiClient.post('/users/update-profile', profileData);
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    // Search users
    searchUsers: async (params: UserSearchParams) => {
        const response = await apiClient.get('/users/search', { params });
        return response.data;
    },

    // Follow a user
    followUser: async (userUuid: string) => {
        const response = await apiClient.post('/users/follow', { user_uuid: userUuid });
        return response.data;
    },

    // Get followers list
    getFollowers: async (params: FollowersParams) => {
        const response = await apiClient.get('/users/followers', { params });
        return response.data;
    },

    // Fetch user profile
    async fetchProfile(address: string) {
        console.debug('[userService] fetchProfile called', address);
        // TODO: Implement API call
        return null;
    },

    // Fetch user portfolio
    async fetchPortfolio(address: string) {
        console.debug('[userService] fetchPortfolio called', address);
        // TODO: Implement API call
        return [];
    },

    // Fetch user transaction history
    async fetchTransactions(address: string) {
        console.debug('[userService] fetchTransactions called', address);
        // TODO: Implement API call
        return [];
    },

    // Fetch all creators (tries API, falls back to mock data)
    async fetchCreators(page: number = 1, page_size: number = 20) {
        try {
            // Attempt to use searchUsers with a filter for creators (if supported by backend)
            const params: UserSearchParams & { role?: string } = { page, page_size, text: '', role: 'creator' };
            const response = await userService.searchUsers(params);
            if (response && response.data) {
                console.debug('[userService] fetchCreators success', response.data);
                return response.data;
            }
            // If response structure is different, log and fallback
            console.warn('[userService] fetchCreators: Unexpected response structure', response);
        } catch (e) {
            console.error('[userService] fetchCreators error, falling back to mock data:', e);
        }
        // Fallback: return mock creator data
        const mockCreators = [
            {
                address: '0xmock1',
                name: 'Mock Creator 1',
                description: 'This is a mock creator for fallback.',
                uri: '',
                stats: {},
                passConfig: {},
                tiers: [],
            },
            {
                address: '0xmock2',
                name: 'Mock Creator 2',
                description: 'Another mock creator.',
                uri: '',
                stats: {},
                passConfig: {},
                tiers: [],
            },
        ];
        return mockCreators;
    },
};

export default userService; 