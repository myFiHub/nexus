// Creator type definition for Podium Platform
// Represents an individual creator with passes and subscriptions

import { PassConfig, SubscriptionConfig, OutpostStats } from './shared';

export interface Creator {
  address: string;
  name: string;
  description: string;
  uri: string;
  stats: OutpostStats;
  passConfig: PassConfig;
  tiers: SubscriptionConfig[];
  // Additional fields can be added as needed
} 