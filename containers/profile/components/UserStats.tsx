"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { User } from "app/services/api/types";
import { useSelector } from "react-redux";
import BalanceDisplay from "../../../components/BalanceDisplay";
import { StatCard } from "./StatCard";

interface UserStatsProps {
  user: User;
}

export const UserStats = ({ user }: UserStatsProps) => {
  const remainingReferrals = user?.remaining_referrals_count || 0;
  const referralsCount = user?.referrals_count || 0;
  const receivedBooCount = user?.received_boo_count || 0;
  const receivedBooAmount = user?.received_boo_amount || 0;
  const sentBooCount = user?.sent_boo_count || 0;
  const sentBooAmount = user?.sent_boo_amount || 0;
  const receivedCheerCount = user?.received_cheer_count || 0;
  const receivedCheerAmount = user?.received_cheer_amount || 0;

  const equivalentReceivedBooAmount = useSelector(
    GlobalSelectors.moveToUsd(receivedBooAmount)
  );
  const equivalentSentBooAmount = useSelector(
    GlobalSelectors.moveToUsd(sentBooAmount)
  );
  const equivalentReceivedCheerAmount = useSelector(
    GlobalSelectors.moveToUsd(receivedCheerAmount)
  );

  return (
    <>
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg">
          <div className="text-sm text-foreground/80">Available Balance</div>
          <BalanceDisplay />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4  gap-4 mb-8">
        <StatCard
          title="Referrals"
          value={referralsCount}
          subtitle={`Remaining: ${remainingReferrals}`}
        />
        <StatCard
          title="Received Boo"
          value={receivedBooCount}
          subtitle={
            <div className="flex items-center gap-2">
              <span>Amount:</span>
              <span>{user?.received_boo_amount || 0} MOVE</span>
              {Number(equivalentReceivedBooAmount) > 0 ? (
                <span>~ {equivalentReceivedBooAmount} USD</span>
              ) : null}
            </div>
          }
        />
        <StatCard
          title="Sent Boo"
          value={sentBooCount}
          subtitle={
            <div className="flex items-center gap-2">
              <span>Amount:</span>
              <span>{sentBooAmount} MOVE</span>
              {Number(equivalentSentBooAmount) > 0 ? (
                <span>~ {equivalentSentBooAmount} USD</span>
              ) : null}
            </div>
          }
        />
        <StatCard
          title="Received Cheer"
          value={receivedCheerCount}
          subtitle={
            <div className="flex items-center gap-2">
              <span>Amount:</span>
              <span>{receivedCheerAmount} MOVE</span>
              {Number(equivalentReceivedCheerAmount) > 0 ? (
                <span>~ {equivalentReceivedCheerAmount} USD</span>
              ) : null}
            </div>
          }
        />
      </div>
    </>
  );
};
