/// <reference types="vite/client" />

import axios from 'axios';

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_PODIUM_BACKEND_BASE_URL || 'http://localhost:3000/api/v1',
    WS_URL: import.meta.env.VITE_WEBSOCKET_ADDRESS || 'ws://localhost:3000/api/v1/ws',
    TIMEOUT: 30000, // 30 seconds
};

console.debug('[api.config] API base URL:', API_CONFIG.BASE_URL);
console.debug('[api.config] WebSocket URL:', API_CONFIG.WS_URL);

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Here you can implement token refresh logic if needed
            // For now, we'll just redirect to login
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// WebSocket connection helper
export const createWebSocketConnection = (token: string) => {
    const ws = new WebSocket(API_CONFIG.WS_URL);
    ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'auth', token }));
    };
    return ws;
}; 