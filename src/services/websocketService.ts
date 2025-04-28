import { createWebSocketConnection } from '../config/api.config';

export type WebSocketMessageHandler = (data: any) => void;

class WebSocketService {
    private ws: WebSocket | null = null;
    private messageHandlers: Map<string, WebSocketMessageHandler[]> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 1000; // 1 second

    connect(token: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        this.ws = createWebSocketConnection(token);
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.ws) return;

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const handlers = this.messageHandlers.get(data.type) || [];
                handlers.forEach(handler => handler(data));
            } catch (error) {
                console.error('WebSocket message parsing error:', error);
            }
        };

        this.ws.onclose = () => {
            this.handleDisconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleDisconnect();
        };
    }

    private handleDisconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    this.connect(token);
                }
            }, this.reconnectTimeout * this.reconnectAttempts);
        }
    }

    subscribe(type: string, handler: WebSocketMessageHandler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type)?.push(handler);
    }

    unsubscribe(type: string, handler: WebSocketMessageHandler) {
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    send(type: string, data: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, ...data }));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.messageHandlers.clear();
        this.reconnectAttempts = 0;
    }
}

export const websocketService = new WebSocketService(); 