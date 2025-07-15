import { Img } from "app/components/Img";
import { MostFeeEarned } from "app/services/api/types";

export const LeaderboardFees = ({ user }: { user: MostFeeEarned }) => (
  <span className="flex items-center justify-end gap-2 font-semibold text-[#F4F4F4]">
    <Img src={"/movement_logo.svg"} alt="logo" className="w-4 h-4" />
    {user.total_fee.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
  </span>
);
