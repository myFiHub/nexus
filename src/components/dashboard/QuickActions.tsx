import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * QuickActions: buy/sell, subscribe, claim rewards
 */
const QuickActions: React.FC = () => {
  return (
    <Card className="p-6 flex flex-wrap gap-4 items-center">
      <h2 className="text-lg font-bold mb-2 w-full">Quick Actions</h2>
      <Button variant="primary">Buy Pass</Button>
      <Button variant="secondary">Sell Pass</Button>
      <Button variant="primary">Subscribe</Button>
      <Button variant="ghost">Claim Rewards</Button>
    </Card>
  );
};

export default QuickActions; 