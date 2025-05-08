import React from 'react';
import Card from '../common/Card';

/**
 * PortfolioOverview props
 */
type PortfolioOverviewProps = {
  portfolio: {
    value: number;
    passes: number;
    subscriptions: number;
  };
};

/**
 * PortfolioOverview: shows portfolio value, passes, subscriptions, and a chart placeholder
 */
const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  return (
    <Card className="p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-3xl font-bold text-primary-500">{portfolio.value}Ξ</div>
          <div className="text-neutral-600">Total Value</div>
          <div className="text-sm text-neutral-500">Passes: <b>{portfolio.passes}</b> · Subscriptions: <b>{portfolio.subscriptions}</b></div>
        </div>
        <div className="flex-1">
          <div className="bg-neutral-100 rounded h-24 flex items-center justify-center text-neutral-400">
            [Portfolio Chart Coming Soon]
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioOverview; 