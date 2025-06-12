import { useEffect } from "react";

import {
  FollowerModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";

export const FollowFetcher = ({
  passBuyers,
  followers,
  followings,
}: {
  passBuyers: PodiumPassBuyerModel[];
  followers: FollowerModel[];
  followings: FollowerModel[];
}) => {
  return <div>FollowFetcher</div>;
};
