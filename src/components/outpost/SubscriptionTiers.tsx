import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * SubscriptionTiers props
 */
type Tier = {
  id: number;
  name: string;
  price: number;
  duration: number;
  maxSupply: number;
  benefits: string[];
};
type SubscriptionTiersProps = {
  tiers: Tier[];
};

/**
 * SubscriptionTiers: cards for each subscription tier
 */
const SubscriptionTiers: React.FC<SubscriptionTiersProps> = ({ tiers }) => {
  if (!tiers || tiers.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold mb-2">Subscription Tiers</h2>
      {tiers.map((tier, idx) => (
        <Card key={tier.id} hoverable className={`p-6 ${idx === tiers.length - 1 ? 'border-2 border-primary-500' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-semibold">{tier.name}</h3>
            <span className="text-primary-500 font-bold">{tier.price}Ξ</span>
          </div>
          <div className="text-xs text-neutral-500 mb-2">Duration: {tier.duration} days · Max: {tier.maxSupply}</div>
          <ul className="text-sm mb-2 list-disc list-inside">
            {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          {idx === tiers.length - 1 && <span className="badge bg-primary-100 text-primary-500 px-2 py-1 rounded text-xs mr-2">Best Value</span>}
          <Button variant="primary">Subscribe</Button>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionTiers; 