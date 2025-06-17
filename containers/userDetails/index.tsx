import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";
import { ClientRedirecter } from "./components/clientRedirecter";
import { UserTabs } from "./components/tabs";
import { UserProfile } from "./components/UserProfile";
import { UserStats } from "./components/UserStats";

interface UserDetailsProps {
  user: User;
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
}

export const UserDetails = ({
  user,
  passBuyers,
  followers,
  followings,
}: UserDetailsProps) => {
  return (
    <>
      <ClientRedirecter id={user.uuid} />
      <div className="p-4 sm:p-6 mt-12">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">User Details</div>
        </div>
        <UserProfile user={user} />
        <UserStats user={user} />
        <UserTabs
          user={user}
          passBuyers={passBuyers}
          followers={followers}
          followings={followings}
        />
      </div>
    </>
  );
};
