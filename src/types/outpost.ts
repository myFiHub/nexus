// Outpost type definition for Podium Platform
// Represents a virtual club/space with passes and subscriptions

import { PassConfig, SubscriptionConfig, OutpostStats } from './shared';

export interface Outpost {
  address: string;
  owner: string;
  name: string;
  description: string;
  uri: string;
  createdAt: number;
  paused: boolean;
  passConfig: PassConfig;
  tiers: SubscriptionConfig[];
  stats: OutpostStats;
} 