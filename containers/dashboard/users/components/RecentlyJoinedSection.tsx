import { AppPages } from "app/lib/routes";
import { RecentlyJoinedUser } from "app/services/api/types";
import { Clock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { UserCard } from "./UserCard";

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
          href: AppPages.users + "/recently_joined",
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {usersWithFollowers.map((user) => (
          <UserCard
            key={user.address}
            user={user}
            displayType="followers"
            displayValue={user.followers}
            displayColor="text-primary"
          />
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
