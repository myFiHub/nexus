import { apiClient } from '../config/api.config';

export interface SocialInteraction {
  id: string;
  type: 'CHEER' | 'BOO' | 'FOLLOW' | 'COMMENT';
  userId: string;
  targetId: string;
  content?: string;
  timestamp: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'PASS_PURCHASE' | 'PASS_SALE' | 'SUBSCRIPTION' | 'INTERACTION';
  userId: string;
  targetId?: string;
  content: string;
  timestamp: number;
  metadata?: any;
}

export interface Notification {
  id: string;
  type: 'SOCIAL' | 'TRANSACTION' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  metadata?: any;
}

export const socialService = {
  // User Interactions
  sendInteraction: async (targetId: string, type: SocialInteraction['type'], content?: string) => {
    const response = await apiClient.post('/social/interactions', {
      targetId,
      type,
      content
    });
    return response.data;
  },

  getInteractions: async (userId: string, type?: SocialInteraction['type']) => {
    const response = await apiClient.get('/social/interactions', {
      params: { userId, type }
    });
    return response.data;
  },

  // Activity Feed
  getActivityFeed: async (page: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get('/social/activity-feed', {
      params: { page, pageSize }
    });
    return response.data;
  },

  // Notifications
  getNotifications: async (page: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get('/social/notifications', {
      params: { page, pageSize }
    });
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await apiClient.put(`/social/notifications/${notificationId}/read`);
    return response.data;
  },

  // User Discovery
  getSuggestedUsers: async (page: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get('/social/suggested-users', {
      params: { page, pageSize }
    });
    return response.data;
  },

  // Social Stats
  getUserStats: async (userId: string) => {
    const response = await apiClient.get(`/social/stats/${userId}`);
    return response.data;
  }
}; 