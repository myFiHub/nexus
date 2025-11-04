import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";

import UserLink from "app/components/AppLink/userLink";
import { Img } from "app/components/Img";
import { FollowButton } from "app/containers/_users/components/followButton";
import { defaultProfilePic } from "app/lib/constants";
import { truncate } from "app/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/Tabs";
import { UserDetailsSliceInjector } from "./sliceInjector";

interface UserTabsProps {
  user: User;
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
}

const UserCard = ({ user }: { user: FollowerModel | PodiumPassBuyerModel }) => {
  const isExternalUser = !user.uuid;
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-2 hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Img
            src={user.image || defaultProfilePic}
            alt={user.name || "User"}
            className="object-cover"
            useImgTag
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {!isExternalUser
              ? `id: ${truncate(user.uuid, 10)}`
              : "External User"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        <UserLink
          disabled={isExternalUser}
          id={user.uuid}
          className="text-sm text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
        >
          View Profile
        </UserLink>
        <FollowButton
          id={user.uuid}
          size="xxs"
          noScale
          followed={user.followed_by_me}
          address={user.address}
        />
      </div>
    </div>
  );
};

export const UserTabs = ({
  passBuyers,
  followers,
  followings,
}: UserTabsProps) => {
  return (
    <>
      <UserDetailsSliceInjector />
      <Tabs defaultValue="pass-holders" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pass-holders">Pass Holders</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value="pass-holders" className="mt-4">
          <div className="space-y-2">
            {passBuyers.map((buyer) => (
              <UserCard key={buyer.uuid} user={buyer} />
            ))}
            {passBuyers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pass holders found
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-4">
          <div className="space-y-2">
            {followings.map((following) => (
              <UserCard key={following.uuid} user={following} />
            ))}
            {followings.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Not following anyone
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="followers" className="mt-4">
          <div className="space-y-2">
            {followers.map((follower) => (
              <UserCard key={follower.uuid} user={follower} />
            ))}
            {followers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No followers yet
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
