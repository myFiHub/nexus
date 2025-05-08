import React from 'react';
import Card from '../common/Card';

/**
 * CommunityFeed props
 */
type CommunityFeedProps = {
  outpost: any;
};

/**
 * CommunityFeed: gated content feed (placeholder)
 */
const CommunityFeed: React.FC<CommunityFeedProps> = ({ outpost }) => {
  return (
    <Card className="mt-8 p-6">
      <h2 className="text-xl font-bold mb-4">Community Feed</h2>
      <div className="text-neutral-400 text-center py-8">[Exclusive content for pass/subscription holders coming soon]</div>
    </Card>
  );
};

export default CommunityFeed; 