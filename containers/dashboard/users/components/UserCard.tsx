import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import {
  RecentlyJoinedUser,
  TopOwner,
  TradingVolume,
} from "app/services/api/types";

interface UserCardProps {
  user: RecentlyJoinedUser | TopOwner | TradingVolume;
  displayType: "price" | "volume" | "followers";
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
      default:
        return "";
    }
  };

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
              src={user.image || logoUrl}
              alt={user.name || "User"}
              useImgTag
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            {user.name || "Anonymous"}

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
            {typeof displayValue === "number"
              ? displayValue.toFixed(2)
              : displayValue}
          </p>
          <p className="text-xs text-muted-foreground">{getDisplayLabel()}</p>
        </div>
      </div>
    </div>
  );
};
