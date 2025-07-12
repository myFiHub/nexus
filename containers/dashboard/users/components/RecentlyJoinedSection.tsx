import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { logoUrl } from "app/lib/constants";
import { RecentlyJoinedUser } from "app/services/api/types";
import { Clock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

interface RecentlyJoinedSectionProps {
  recentlyJoinedUsers: RecentlyJoinedUser[];
}

// Mock follower data - in real app this would come from API
const mockFollowerData = [
  { address: "0x1234", followers: 0 },
  { address: "0x5678", followers: 18 },
  { address: "0x9abc", followers: 0 },
];

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
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

export const RecentlyJoinedSection = ({
  recentlyJoinedUsers,
}: RecentlyJoinedSectionProps) => {
  // Create mock users with follower data
  const usersWithFollowers = recentlyJoinedUsers
    .slice(0, 3)
    .map((user, index) => ({
      ...user,
      followers:
        mockFollowerData[index]?.followers || Math.floor(Math.random() * 50),
    }));

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Clock className="w-5 h-5 text-blue-500" />}
        title="Recently Joined"
        seeMore={{
          href: "/all_outposts",
          params: { filter: "recently_joined" },
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {usersWithFollowers.map((user) => (
          <div
            key={user.address}
            className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-border/80 transition-colors"
          >
            <UserLink underline={false} id={user.aptos_address}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Img
                    useImgTag
                    src={user.image || logoUrl}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground line-clamp-1">
                    {user.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate font-mono">
                    {user.aptos_address.slice(0, 6)}...
                    {user.aptos_address.slice(-4)}
                  </p>
                </div>
              </div>
            </UserLink>
            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {user.followers}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {formatTime(user.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {usersWithFollowers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No recently joined users
          </div>
        )}
      </div>
    </div>
  );
};
