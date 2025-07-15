import {
  RecentlyJoinedUser,
  TopOwner,
  Trade,
  TradingVolume,
} from "app/services/api/types";
import { RecentlyJoinedSection } from "./components/RecentlyJoinedSection";
import { TopAccountsSection } from "./components/TopAccountsSection";
import { TradingActivitySection } from "./components/tradingActivity";
import { TrendingVolumeSection } from "./components/TrendingVolumeSection";
import { DashboardUsersInjector } from "./injector";

export const Users = ({
  recentlyJoinedUsers,
  topOwners,
  trades,
  tradingVolume,
}: {
  recentlyJoinedUsers: RecentlyJoinedUser[];
  topOwners: TopOwner[];
  trades: Trade[];
  tradingVolume: TradingVolume[];
}) => {
  return (
    <>
      <DashboardUsersInjector />
      <div className="min-h-screen bg-background p-6">
        {/* Search Bar
      <div className="mb-8">
        <div className="relative  ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search with username or contract address"
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div> */}

        {/* Main Content - Vertical Stack */}
        <div className="space-y-6">
          {/* Top Accounts */}
          <TopAccountsSection topOwners={topOwners} />

          {/* Trending Volume */}
          <TrendingVolumeSection tradingVolume={tradingVolume} />

          {/* Recently Joined */}
          <RecentlyJoinedSection recentlyJoinedUsers={recentlyJoinedUsers} />

          {/* Trading Activity */}
          <TradingActivitySection trades={trades} />
        </div>
      </div>
    </>
  );
};
