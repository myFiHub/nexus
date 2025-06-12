import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";

import { Img } from "app/components/Img";
import { FollowButton } from "app/containers/userDetails/components/tabs/followButton";
import { truncate } from "app/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/Tabs";
import { FollowFetcher } from "./followFetcher";

interface UserTabsProps {
  user: User;
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
}

const UserCard = ({ user }: { user: FollowerModel | PodiumPassBuyerModel }) => {
  return (
    <div className="flex items-center justify-between p-4 border  rounded-lg mb-2">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Img
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User"}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">
            id: {truncate(user.uuid, 10)}
          </p>
        </div>
        <div className="flex-1"></div>
        <FollowButton user={user} />
      </div>
    </div>
  );
};

export const UserTabs = ({
  user,
  passBuyers,
  followers,
  followings,
}: UserTabsProps) => {
  return (
    <>
      <FollowFetcher user={user} />
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
