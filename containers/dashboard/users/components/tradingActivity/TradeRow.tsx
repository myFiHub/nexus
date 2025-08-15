import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { EquivalentPrice_StyleLess } from "app/components/styleLessInfo/equivalentPrice";
import { logoUrl, movementLogoUrl } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import { Trade } from "app/services/api/types";

interface TradeRowProps {
  trade: Trade;
  gridCols: string;
}

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

// Truncate names longer than 9 characters
const truncateName = (name?: string) => {
  if (!name) return "";
  return name.length > 9 ? name.slice(0, 9) + "…" : name;
};

export const TradeRow = ({ trade, gridCols }: TradeRowProps) => {
  return (
    <div className={`${gridCols} p-4 hover:bg-muted/20 transition-colors`}>
      {/* Action */}
      <div className="flex items-center">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            trade.trade_type === "buy"
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {trade.trade_type.charAt(0).toUpperCase() + trade.trade_type.slice(1)}
        </span>
      </div>

      {/* Total Price */}
      <div className="flex items-center flex-col">
        <div className="flex items-center">
          <span className="font-medium">{trade.price}</span>
          <span className="text-[8px] text-muted-foreground pl-1">MOVE</span>
          <span className="text-xs text-muted-foreground">
            <Img
              src={movementLogoUrl}
              alt="logo"
              useImgTag
              className="w-2 h-2 ml-1"
            />
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          $<EquivalentPrice_StyleLess amountInMove={trade.price} />
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center">
        <span className="text-sm">{trade.count}</span>
        <span className="text-[8px] text-muted-foreground pl-2">Pass</span>
      </div>

      {/* From */}
      <UserLink
        underline={false}
        id={trade.podium_pass_owner_uuid}
        ignore={!trade.podium_pass_owner_name}
        className="justify-start p-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Img
              src={trade.podium_pass_owner_image}
              alt={
                trade.podium_pass_owner_name ?? trade.podium_pass_owner_address
              }
              className="w-full h-full object-cover"
              useImgTag
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium truncate ${
                trade.podium_pass_owner_name
                  ? "text-foreground"
                  : "text-muted-foreground text-[8px]"
              }`}
            >
              {truncateName(trade.podium_pass_owner_name) || "External User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {truncate(trade.podium_pass_owner_address)}
            </p>
          </div>
        </div>
      </UserLink>

      {/* Trader */}
      <UserLink
        underline={false}
        id={trade.user_uuid}
        ignore={!trade.user_name}
        className="justify-start p-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Img
              src={trade.user_image || logoUrl}
              alt={trade.user_name}
              className="w-full h-full object-cover"
              useImgTag
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium truncate ${
                trade.user_name
                  ? "text-foreground"
                  : "text-muted-foreground text-[8px]"
              }`}
            >
              {truncateName(trade.user_name) || "External User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {truncate(trade.user_address)}
            </p>
          </div>
        </div>
      </UserLink>

      {/* Fees Earned */}
      <div className="flex items-center flex-col">
        <div className="flex items-center">
          <span className="font-medium">{trade.fees_earned}</span>
          <span className="text-[8px] text-muted-foreground pl-1">MOVE</span>
          {/* move logo */}
          <span className="text-xs text-muted-foreground">
            <Img
              src={movementLogoUrl}
              alt="logo"
              useImgTag
              className="w-2 h-2 ml-1"
            />
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          $<EquivalentPrice_StyleLess amountInMove={trade.fees_earned} />
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground">
          {formatTime(trade.created_at * 1000)}
        </span>
      </div>
    </div>
  );
};
