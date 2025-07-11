import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { truncate } from "app/lib/utils";
import { User } from "app/services/api/types";
import { FollowButton } from "../../_users/components/followButton";
import { PodiumPassButton } from "./podiumPassButton/index";

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {user.image && (
        <Img
          src={user.image}
          alt={user.name || "User"}
          width={80}
          height={80}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          useImgTag
        />
      )}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">
          {user.name || "Anonymous User"}
        </h1>
        {user.aptos_address && (
          <div className="flex items-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {truncate(user.aptos_address, 20)}
            </p>
            <CopyButton text={user.aptos_address} />
          </div>
        )}
      </div>
      <PodiumPassButton user={user} />
      <FollowButton
        id={user.uuid}
        size="md"
        followed={!!user.followed_by_me}
        address={user.address}
      />
    </div>
  );
};
