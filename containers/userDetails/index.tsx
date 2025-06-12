import { User } from "app/services/api/types";

interface UserDetailsProps {
  user: User;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-20 h-20 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {user.name || "Anonymous User"}
          </h1>
          {user.email && <p className="text-gray-600">{user.email}</p>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">Followers</h3>
          <p className="text-2xl">{user.followers_count || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">Following</h3>
          <p className="text-2xl">{user.followings_count || 0}</p>
        </div>
      </div>
    </div>
  );
};
