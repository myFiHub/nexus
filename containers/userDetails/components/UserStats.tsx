import { User } from "app/services/api/types";

interface UserStatsProps {
  user: User;
}

export const UserStats = ({ user }: UserStatsProps) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 bg-card-bg rounded-lg">
        <h3 className="font-semibold text-sm sm:text-base">Followers</h3>
        <p className="text-xl sm:text-2xl">{user.followers_count || 0}</p>
      </div>
      <div className="p-4 bg-card-bg rounded-lg">
        <h3 className="font-semibold text-sm sm:text-base">Following</h3>
        <p className="text-xl sm:text-2xl">{user.followings_count || 0}</p>
      </div>
    </div>
  );
};
