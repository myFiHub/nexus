import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * PassTrading props
 */
type PassTradingProps = {
  outpost: {
    stats: { price: number };
  };
};

/**
 * PassTrading: price chart (placeholder) and buy/sell form
 */
const PassTrading: React.FC<PassTradingProps> = ({ outpost }) => {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-xl font-bold mb-4">Pass Trading</h2>
      {/* Price chart placeholder */}
      <div className="bg-neutral-100 rounded h-32 flex items-center justify-center mb-6 text-neutral-400">
        [Price Chart Coming Soon]
      </div>
      {/* Buy/Sell form */}
      <form className="flex flex-col md:flex-row gap-4 items-center">
        <Input type="number" min={1} placeholder="Amount" className="w-32" />
        <Button variant="primary">Buy Pass</Button>
        <Button variant="secondary">Sell Pass</Button>
        <span className="text-xs text-neutral-500 ml-2">Current Price: <b>{outpost.stats.price}Ξ</b></span>
      </form>
    </Card>
  );
};

export default PassTrading; 