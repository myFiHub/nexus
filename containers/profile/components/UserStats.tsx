"use client";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { User } from "app/services/api/types";
import { useSelector } from "react-redux";
import { StatCard } from "./StatCard";

interface UserStatsProps {
  user: User;
}

export const UserStats = ({ user }: UserStatsProps) => {
  const balance = useSelector(AssetsSelectors.balance);
  const isLoading = useSelector(AssetsSelectors.balance).loading;

  return (
    <>
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <div className="text-sm text-blue-100">Available Balance</div>
          {isLoading ? (
            <div className="h-8 w-32 bg-blue-400/20 animate-pulse rounded mt-1" />
          ) : (
            <div className="text-3xl font-bold text-white mt-1 h-8">
              {balance?.value || "0"}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Referrals"
          value={user?.referrals_count || 0}
          subtitle={`Remaining: ${user?.remaining_referrals_count || 0}`}
        />
        <StatCard
          title="Received Boo"
          value={user?.received_boo_count || 0}
          subtitle={`Amount: ${user?.received_boo_amount || 0}`}
        />
        <StatCard
          title="Sent Boo"
          value={user?.sent_boo_count || 0}
          subtitle={`Amount: ${user?.sent_boo_amount || 0}`}
        />
        <StatCard
          title="Received Cheer"
          value={user?.received_cheer_count || 0}
          subtitle={`Amount: ${user?.received_cheer_amount || 0}`}
        />
      </div>
    </>
  );
};
