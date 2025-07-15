import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import {
  RecentlyJoinedUser,
  TopOwner,
  TradingVolume,
} from "app/services/api/types";
import { formatDistanceToNow } from "date-fns";

interface UserCardProps {
  user: RecentlyJoinedUser | TopOwner | TradingVolume;
  displayType: "price" | "volume" | "followers" | "joinedAt";
  displayValue: string | number;
  displayIcon?: React.ReactNode;
  displayColor?: string;
}

export const UserCard = ({
  user,
  displayType,
  displayValue,
  displayIcon,
  displayColor = "text-primary",
}: UserCardProps) => {
  const getDisplayLabel = () => {
    switch (displayType) {
      case "price":
        return "Price";
      case "volume":
        return "Volume";
      case "followers":
        return "Followers";
      case "joinedAt":
        return "Ago";
      default:
        return "";
    }
  };

  const formatDisplayValue = (value: string | number) => {
    if (typeof value === "string") return value;

    switch (displayType) {
      case "followers":
        return Math.floor(value).toString(); // Whole numbers for followers
      case "price":
      case "volume":
        return value.toFixed(2); // 2 decimal places for price and volume
      case "joinedAt":
        return formatDistanceToNow(new Date(value * 1000));
      default:
        return value.toString();
    }
  };
  const userImage = user.image || logoUrl;

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-border/80 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <UserLink
          id={user.aptos_address}
          underline={false}
          className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1 flex gap-3"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Img
              src={userImage}
              alt={user.name || "User"}
              useImgTag
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm   truncate font-mono">
              {user.name || "Anonymous"}
            </p>

            <p className="text-sm text-muted-foreground truncate font-mono">
              {user.aptos_address.slice(0, 6)}...{user.aptos_address.slice(-4)}
            </p>
          </div>
        </UserLink>
      </div>
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {displayIcon && displayIcon}
        <div className="text-right">
          <p className={`font-semibold ${displayColor}`}>
            {formatDisplayValue(displayValue)}
          </p>
          <p className="text-xs text-muted-foreground">{getDisplayLabel()}</p>
        </div>
      </div>
    </div>
  );
};
