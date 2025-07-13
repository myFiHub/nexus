import { Img } from "app/components/Img";
import { Trade } from "app/services/api/types";
import { BarChart3 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

interface TradingActivitySectionProps {
  trades: Trade[];
}

export const TradingActivitySection = ({
  trades,
}: TradingActivitySectionProps) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <div className="space-y-4 overflow-x-auto">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5 text-green-500" />}
        title="Trading Activity"
        seeMore={{
          href: "/all_outposts",
          params: { filter: "trading_activity" },
        }}
      />

      <div className="bg-card rounded-lg border border-border  min-w-[1024px]  ">
        {/* Filter Row */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <select className="bg-background border border-border rounded px-3 py-1 text-sm">
              <option>All</option>
              <option>Buy</option>
              <option>Sell</option>
            </select>
            <span className="text-sm text-muted-foreground">Filters</span>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 p-4 bg-muted/30 border-b border-border/50 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-info rounded-full"></span>
            All
          </div>
          <div>Total Price</div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-info rounded-full"></span>
            Tickets
          </div>
          <div>Room</div>
          <div>Trader</div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-info rounded-full"></span>
            Fees Earned
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-info rounded-full"></span>
            Tickets Left
          </div>
          <div>Time</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/30">
          {trades.slice(0, 8).map((trade) => (
            <div
              key={trade.uuid}
              className="grid grid-cols-8 gap-4 p-4 hover:bg-muted/20 transition-colors"
            >
              {/* Action */}
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.trade_type === "buy"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {trade.trade_type.charAt(0).toUpperCase() +
                    trade.trade_type.slice(1)}
                </span>
              </div>

              {/* Total Price */}
              <div className="flex items-center">
                <span className="text-destructive font-medium">
                  🔴 {trade.price.toFixed(4)}
                </span>
              </div>

              {/* Tickets */}
              <div className="flex items-center">
                <span className="text-sm">{trade.count}</span>
              </div>

              {/* Room */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Img
                    src={trade.podium_pass_owner_image || "/default-avatar.png"}
                    alt={trade.podium_pass_owner_name}
                    className="w-full h-full object-cover"
                    useImgTag
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {trade.podium_pass_owner_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{trade.podium_pass_owner_address.slice(0, 6)}...
                    {trade.podium_pass_owner_address.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Trader */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Img
                    src={trade.user_image || "/default-avatar.png"}
                    alt={trade.user_name}
                    className="w-full h-full object-cover"
                    useImgTag
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {trade.user_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{trade.user_address.slice(0, 6)}...
                    {trade.user_address.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Fees Earned */}
              <div className="flex items-center">
                <span className="text-destructive font-medium">
                  🔴 {trade.fees_earned.toFixed(6)}
                </span>
              </div>

              {/* Tickets Left */}
              <div className="flex items-center">
                <span className="text-sm">{trade.podium_pass_left}</span>
              </div>

              {/* Time */}
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                  {formatTime(trade.created_at)}
                </span>
              </div>
            </div>
          ))}
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
