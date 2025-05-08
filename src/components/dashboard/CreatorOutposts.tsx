import React from 'react';
import Card from '../common/Card';

/**
 * CreatorOutposts props
 */
type CreatorOutpost = {
  name: string;
  holders: number;
  revenue: number;
};
type CreatorOutpostsProps = {
  outposts: CreatorOutpost[];
};

/**
 * CreatorOutposts: list of creator's outposts
 */
const CreatorOutposts: React.FC<CreatorOutpostsProps> = ({ outposts }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-2">Your Outposts</h2>
      {outposts.length === 0 ? (
        <div className="text-neutral-400">No outposts found.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {outposts.map((o) => (
            <li key={o.name} className="flex justify-between text-sm">
              <span className="font-semibold">{o.name}</span>
              <span>Holders: <b>{o.holders}</b></span>
              <span>Revenue: <b>{o.revenue}Ξ</b></span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default CreatorOutposts; 