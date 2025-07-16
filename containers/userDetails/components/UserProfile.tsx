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
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden">
            <Img
              src={user.image}
              alt={user.name || "User"}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              useImgTag
            />
          </div>
        </div>
      )}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold">
          {user.name || "Anonymous User"}
        </h1>
        {user.aptos_address && (
          <div className="flex items-center">
            <p className="text-gray-400 text-sm sm:text-base">
              {truncate(user.aptos_address, 20)}
            </p>
            <CopyButton text={user.aptos_address} />
          </div>
        )}
      </div>
      <PodiumPassButton user={user} />
      <FollowButton
        id={user.uuid}
        noScale
        size="md"
        followed={!!user.followed_by_me}
        address={user.address}
      />
    </div>
  );
};
