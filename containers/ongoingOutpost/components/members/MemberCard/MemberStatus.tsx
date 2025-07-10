import { Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { RemainingTimeText } from "../remainingTimeText";

interface MemberStatusProps {
  address: string;
}

export const MemberStatus = ({ address }: MemberStatusProps) => {
  const member = useSelector(onGoingOutpostSelectors.member(address));
  if (!member) return null;

  return (
    <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
      {member.remaining_time > 0 ? (
        <div
          className={`flex items-center gap-1 ${
            member.remaining_time < 60 ? "text-red-500" : ""
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>
            <RemainingTimeText address={address} userUuId={member.uuid} />
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-500">
          <Clock className="w-3 h-3" />
          <span>Time is up!</span>
        </div>
      )}
    </div>
  );
};
