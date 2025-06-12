import { CopyButton } from "app/components/copyButton";
import { truncate } from "app/lib/utils";
import { User } from "app/services/api/types";
import { ClientRedirecter } from "./components/clientRedirecter";
import { PodiumPassButton } from "./components/podiumPassButton";

interface UserDetailsProps {
  user: User;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <>
      <ClientRedirecter id={user.uuid} />
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold">
              {user.name || "Anonymous User"}
            </h1>
            {user.aptos_address && (
              <div className="flex items-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  {truncate(user.aptos_address)}
                </p>
                <CopyButton text={user.aptos_address} />
              </div>
            )}
          </div>
          <PodiumPassButton address={user.aptos_address!} />
        </div>

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
      </div>
    </>
  );
};
