import React, { useState, useEffect } from 'react';
import PortfolioOverview from '../components/dashboard/PortfolioOverview';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavedOutposts from '../components/dashboard/SavedOutposts';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import CreatorOutposts from '../components/dashboard/CreatorOutposts';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';
import Skeleton from '../components/common/Skeleton';

// Mock user data
const mockUser = {
  isCreator: true,
  portfolio: { value: 2.34, passes: 3, subscriptions: 2 },
  transactions: [
    { id: 1, type: 'Buy', outpost: 'CryptoCat', amount: 1, date: '2024-06-01' },
    { id: 2, type: 'Subscribe', outpost: 'ArtByAda', amount: 0.15, date: '2024-05-28' },
  ],
  savedOutposts: [
    { name: 'CryptoCat', avatar: '😺' },
    { name: 'GameGuild', avatar: '🎮' },
  ],
  notifications: [
    { id: 1, type: 'success', message: 'Pass value increased 10%!' },
    { id: 2, type: 'info', message: 'New content from CryptoCat' },
  ],
  creatorOutposts: [
    { name: 'CryptoCat', holders: 1200, revenue: 1.2 },
  ],
  analytics: { revenue: 1.2, holders: 1200, engagement: 87 },
};

/**
 * Dashboard page: user and creator dashboard
 */
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 800);
  }, []);

  console.debug('[Dashboard] Rendering Dashboard page');

  if (loading || !user) {
    return <Skeleton height={400} />;
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <PortfolioOverview portfolio={user.portfolio} />
          <QuickActions />
          <RecentTransactions transactions={user.transactions} />
        </div>
        <div className="flex flex-col gap-8">
          <SavedOutposts outposts={user.savedOutposts} />
          <NotificationsPanel notifications={user.notifications} />
        </div>
      </div>
      {user.isCreator && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <CreatorOutposts outposts={user.creatorOutposts} />
          <AnalyticsPanel analytics={user.analytics} />
        </div>
      )}
    </div>
  );
};

export default Dashboard; 