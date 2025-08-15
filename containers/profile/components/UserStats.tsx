"use client";
import { Button } from "app/components/Button";
import { transferBalanceDialog } from "app/components/Dialog";
import { Loader } from "app/components/Loader";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { assetsActions } from "app/containers/_assets/slice";
import { GlobalSelectors } from "app/containers/global/selectors";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { CircleArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BalanceDisplay from "../../../components/BalanceDisplay";
import { StatCard } from "./StatCard";

interface UserStatsProps {
  user: User;
}

export const UserStats = ({ user }: UserStatsProps) => {
  const dispatch = useDispatch();
  const balance = useSelector(AssetsSelectors.balance);
  const gettingBalance = balance.loading;
  const balanceValue = balance.value;
  const remainingReferrals = user?.remaining_referrals_count || 0;
  const referralsCount = user?.referrals_count || 0;
  const receivedBooCount = user?.received_boo_count || 0;
  const receivedBooAmount = user?.received_boo_amount || 0;
  const sentBooCount = user?.sent_boo_count || 0;
  const sentBooAmount = user?.sent_boo_amount || 0;
  const receivedCheerCount = user?.received_cheer_count || 0;
  const receivedCheerAmount = user?.received_cheer_amount || 0;

  const [transfering, setTransfering] = useState(false);

  const equivalentReceivedBooAmount = useSelector(
    GlobalSelectors.moveToUsd(receivedBooAmount)
  );
  const equivalentSentBooAmount = useSelector(
    GlobalSelectors.moveToUsd(sentBooAmount)
  );
  const equivalentReceivedCheerAmount = useSelector(
    GlobalSelectors.moveToUsd(receivedCheerAmount)
  );

  const transferBalance = async () => {
    setTransfering(true);
    const result = await transferBalanceDialog();
    if (result && result.amount > 0) {
      await movementService.sendMoveToAddress({
        targetAddress: result.address,
        amount: result.amount,
      });
      dispatch(assetsActions.getBalance());
    }

    setTransfering(false);
  };
  const loading = transfering || gettingBalance;

  return (
    <>
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg">
          <div className="text-sm text-foreground/80">Available Balance</div>
          <div className="flex items-center gap-2">
            <BalanceDisplay />
            {balanceValue !== "0" ? (
              <Button
                onClick={transferBalance}
                variant="ghost"
                className="ml-1 mt-2"
                size="xxs"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <CircleArrowOutUpRight className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <></>
            )}
          </div>
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
