// Subscription type definition for Podium Platform
// Represents a user's subscription to an outpost or creator tier

export interface Subscription {
  targetType: 'outpost' | 'creator';
  targetAddress: string;
  tierId: number;
  startTimestamp: number;
  endTimestamp: number;
  status: 'active' | 'expired' | 'cancelled';
} 