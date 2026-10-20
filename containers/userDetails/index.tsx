import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";
import { ClientRedirecter } from "./components/clientRedirecter";
import { SocialLink } from "./components/socialLink";
import { UserTabs } from "./components/tabs";
import { LiveNowCard } from "./components/social";
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
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
        <UserProfile user={user} followers={followers} followings={followings} />
        <LiveNowCard userId={user.uuid} />
        <SocialLink user={user} />
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
