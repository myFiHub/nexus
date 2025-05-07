// User type definition for Podium Platform
// Represents a platform user (fan, trader, or creator)

import { Outpost } from './outpost';
import { Creator } from './creator';

export interface UserPortfolioItem {
  targetType: 'outpost' | 'creator';
  targetAddress: string;
  passBalance: number;
  subscriptions: number[]; // Array of active subscription tier IDs
}

export interface User {
  address: string;
  username?: string;
  profileUri?: string;
  bio?: string;
  portfolio: UserPortfolioItem[];
  followedOutposts: string[];
  followedCreators: string[];
} 