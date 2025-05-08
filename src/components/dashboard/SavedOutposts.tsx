import React from 'react';
import Card from '../common/Card';

/**
 * SavedOutposts props
 */
type Outpost = {
  name: string;
  avatar?: string;
};
type SavedOutpostsProps = {
  outposts: Outpost[];
};

/**
 * SavedOutposts: list of saved/followed outposts
 */
const SavedOutposts: React.FC<SavedOutpostsProps> = ({ outposts }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-2">Saved Outposts</h2>
      {outposts.length === 0 ? (
        <div className="text-neutral-400">No saved outposts.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {outposts.map((o, i) => (
            <li key={o.name} className="flex items-center gap-2 text-sm">
              <span className="text-2xl" aria-hidden>{o.avatar || '🏰'}</span>
              <span>{o.name}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default SavedOutposts; 