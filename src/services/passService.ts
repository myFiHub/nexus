import { apiClient } from '../config/api.config';
import podiumProtocol from './podiumProtocol';

export interface PassConfig {
  name: string;
  description: string;
  initialPrice: number;
  maxSupply: number;
  bondingCurve: {
    type: 'LINEAR' | 'EXPONENTIAL';
    slope: number;
  };
  metadata?: {
    image?: string;
    tags?: string[];
    links?: {
      website?: string;
      twitter?: string;
      discord?: string;
    };
  };
}

export interface PassStats {
  totalSupply: number;
  currentPrice: number;
  holders: number;
  volume24h: number;
  priceHistory: {
    timestamp: number;
    price: number;
  }[];
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: number;
  from: string;
  to: string;
}

export const passService = {
  // Pass Creation and Management
  createPass: async (outpostId: string, config: PassConfig) => {
    const response = await apiClient.post(`/outposts/${outpostId}/passes`, config);
    return response.data;
  },

  updatePass: async (outpostId: string, passId: string, config: Partial<PassConfig>) => {
    const response = await apiClient.put(`/outposts/${outpostId}/passes/${passId}`, config);
    return response.data;
  },

  // Pass Trading
  buyPass: async (outpostId: string, amount: number, referrer?: string, wallet?: any) => {
    const client = await podiumProtocol.getWorkingClient();
    return await podiumProtocol.buyPass(
      wallet?.address || '',
      outpostId,
      amount,
      referrer || null,
      wallet
    );
  },

  sellPass: async (outpostId: string, amount: number, wallet?: any) => {
    const client = await podiumProtocol.getWorkingClient();
    return await podiumProtocol.sellPass(
      wallet?.address || '',
      outpostId,
      amount,
      wallet
    );
  },

  // Pass Information
  getPassStats: async (outpostId: string): Promise<PassStats> => {
    const response = await apiClient.get(`/outposts/${outpostId}/passes/stats`);
    return response.data;
  },

  getPassPrice: async (outpostId: string): Promise<number> => {
    return await podiumProtocol.getPassPrice(outpostId);
  },

  getPassBalance: async (outpostId: string, address: string): Promise<number> => {
    return await podiumProtocol.getPassBalance(address, outpostId);
  },

  // Transaction History
  getTransactions: async (outpostId: string, page: number = 1, pageSize: number = 20): Promise<{
    transactions: Transaction[];
    total: number;
  }> => {
    const response = await apiClient.get(`/outposts/${outpostId}/passes/transactions`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  // Portfolio Management
  getPortfolio: async (address: string): Promise<{
    passes: {
      outpostId: string;
      balance: number;
      currentValue: number;
      totalCost: number;
      profitLoss: number;
    }[];
    totalValue: number;
    totalProfitLoss: number;
  }> => {
    const response = await apiClient.get(`/users/${address}/portfolio`);
    return response.data;
  },

  // Price Alerts
  setPriceAlert: async (outpostId: string, targetPrice: number, type: 'ABOVE' | 'BELOW') => {
    const response = await apiClient.post(`/outposts/${outpostId}/passes/price-alerts`, {
      targetPrice,
      type
    });
    return response.data;
  },

  getPriceAlerts: async (outpostId: string) => {
    const response = await apiClient.get(`/outposts/${outpostId}/passes/price-alerts`);
    return response.data;
  }
}; 