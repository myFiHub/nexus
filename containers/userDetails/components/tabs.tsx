import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";

interface UserTabsProps {
  user: User;
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
}

export const UserTabs = ({
  user,
  passBuyers,
  followers,
  followings,
}: UserTabsProps) => {
  return <div>UserTabs</div>;
};
