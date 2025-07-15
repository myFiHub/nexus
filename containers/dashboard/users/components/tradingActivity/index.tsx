import { Trade } from "app/services/api/types";
import { BarChart3 } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { TradeRow } from "./TradeRow";
import { gridCols } from "./classes";
import ClientSideList from "./clientSideList";

interface TradingActivitySectionProps {
  trades: Trade[];
}

export const TradingActivitySection = ({
  trades,
}: TradingActivitySectionProps) => {
  // Common grid classes for header and rows

  return (
    <div className="space-y-4 overflow-x-auto">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5 text-green-500" />}
        title="Trading Activity"
      />

      <div className="bg-card rounded-lg border border-border  min-w-[1024px]  ">
        {/* Filter Row */}
        {/* <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <select className="bg-background border border-border rounded px-3 py-1 text-sm">
              <option>All</option>
              <option>Buy</option>
              <option>Sell</option>
            </select>
            <span className="text-sm text-muted-foreground">Filters</span>
          </div>
        </div> */}

        {/* Table Header */}
        <div
          className={`${gridCols} p-4 bg-muted/30 border-b border-border/50 text-sm font-medium text-muted-foreground`}
        >
          <div className="flex items-center gap-2">Type</div>
          <div>Total Price</div>
          <div className="flex items-center gap-1">Quantity</div>
          <div>From</div>
          <div>Trader</div>
          <div className="flex items-center gap-1">Fees Earned</div>
          <div>Time</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/30">
          {trades.map((trade, index) => (
            <TradeRow key={index} trade={trade} gridCols={gridCols} />
          ))}
          <ClientSideList />
        </div>

        {trades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No trading activity found
          </div>
        )}
      </div>
    </div>
  );
};
