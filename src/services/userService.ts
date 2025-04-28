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

export const userService = {
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
    }
}; 