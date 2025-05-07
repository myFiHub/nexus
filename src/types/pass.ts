// Pass type definition for Podium Platform
// Represents a user's lifetime pass (PodiumPassCoin) for an outpost or creator

export interface Pass {
  targetType: 'outpost' | 'creator';
  targetAddress: string;
  balance: number;
  lastUpdated: number;
} 