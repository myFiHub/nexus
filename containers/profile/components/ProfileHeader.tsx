import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { truncate } from "app/lib/utils";
import { User } from "app/services/api/types";

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => (
  <div className="flex items-center space-x-6 mb-8">
    <div className="relative w-32 h-32 flex-shrink-0">
      {/* Backdrop effect - blurred larger version positioned outside */}
      <div className="absolute inset-0 scale-125 opacity-50 blur-md rounded-full overflow-hidden">
        <Img
          src={user?.image}
          alt=""
          className="w-full h-full object-cover"
          useImgTag
        />
      </div>
      {/* Main profile image */}
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden">
        <Img
          src={user?.image}
          alt={user?.name || "user"}
          className="w-full h-full object-cover"
          useImgTag
        />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h1 className="text-3xl font-bold text-foreground truncate">
        {user?.name || "Anonymous User"}
      </h1>
      {user?.email && (
        <div className="flex gap-2 items-center content-center">
          <p className="text-muted-foreground mt-1 truncate">
            {truncate(user.email)}
          </p>
          <CopyButton text={user.email} className="mt-1" />
        </div>
      )}
      <div className="flex space-x-4 mt-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">{user?.followers_count || 0}</span>{" "}
          Followers
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">{user?.followings_count || 0}</span>{" "}
          Following
        </div>
      </div>
    </div>
  </div>
);
