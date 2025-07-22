"use client";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { User } from "app/services/api/types";
import { useSelector } from "react-redux";
import BalanceDisplay from "../../../components/BalanceDisplay";
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
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg">
          <div className="text-sm text-foreground/80">Available Balance</div>
          <BalanceDisplay />
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
