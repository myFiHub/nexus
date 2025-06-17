"use client";
import podiumApi from "app/services/api";
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
  const handleFakeClick = async () => {
    const response = await podiumApi.buySellPodiumPass({
      count: 1,
      podium_pass_owner_address:
        "0x0e9583e041326faa8b549ad4b3deeb3ee935120fba63b093a46996a2f907b9f2",
      podium_pass_owner_uuid: user.uuid,
      trade_type: "buy",
      tx_hash: "0x123",
    });
    console.log("response", response);
  };
  return (
    <>
      <ClientRedirecter id={user.uuid} />
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">User Details</div>
          <div className="flex items-center gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleFakeClick}
            >
              Buy Pass
            </button>
          </div>
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
