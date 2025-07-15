import { UserTags } from "app/app/(unauthenticated)/users/[filter]/_filters";
import { AppPages } from "app/lib/routes";
import { RecentlyJoinedUser } from "app/services/api/types";
import { Clock } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { UserCard } from "../userCard";

interface RecentlyJoinedSectionProps {
  recentlyJoinedUsers: RecentlyJoinedUser[];
}

export const RecentlyJoinedSection = ({
  recentlyJoinedUsers,
}: RecentlyJoinedSectionProps) => {
  // Create mock users with follower data
  const usersWithFollowers = recentlyJoinedUsers.slice(0, 3);
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Clock className="w-5 h-5 text-blue-500" />}
        title="Recently Joined"
        seeMore={{
          href: AppPages.users + `/${UserTags.RecentlyJoined}`,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {usersWithFollowers.map((user) => (
          <UserCard
            key={user.address}
            user={user}
            displayType="joinedAt"
            displayValue={user.created_at}
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
