// Shared type definitions for Podium Platform
// Used by Outpost, Creator, and other models

// PassConfig: Configuration for passes (lifetime access tokens)
export interface PassConfig {
  initialPrice: string; // BigNumber as string for serialization
  weightB: number;
  creatorFee: number;
  referralFee: number;
  protocolFee: number;
}

// SubscriptionConfig: Configuration for subscription tiers
export interface SubscriptionConfig {
  id: number;
  name: string;
  price: string; // BigNumber as string
  duration: number; // in seconds
  maxSupply: number;
  benefits: string[];
}

// OutpostStats: Statistics for an outpost or creator
export interface OutpostStats {
  totalSupply: number;
  holders: number;
  volume24h: string; // BigNumber as string
  price: string; // BigNumber as string
  marketCap: string; // BigNumber as string
} 