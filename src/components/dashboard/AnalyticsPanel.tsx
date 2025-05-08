import React from 'react';
import Card from '../common/Card';

/**
 * AnalyticsPanel props
 */
type Analytics = {
  revenue: number;
  holders: number;
  engagement: number;
};
type AnalyticsPanelProps = {
  analytics: Analytics;
};

/**
 * AnalyticsPanel: shows analytics for creators
 */
const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analytics }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-2">Analytics</h2>
      <div className="flex flex-col gap-2 mb-4">
        <div>Revenue: <b>{analytics.revenue}Ξ</b></div>
        <div>Holders: <b>{analytics.holders}</b></div>
        <div>Engagement: <b>{analytics.engagement}%</b></div>
      </div>
      <div className="bg-neutral-100 rounded h-20 flex items-center justify-center text-neutral-400">
        [Analytics Chart Coming Soon]
      </div>
    </Card>
  );
};

export default AnalyticsPanel; 