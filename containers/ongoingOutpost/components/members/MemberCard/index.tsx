import { GlobalSelectors } from "app/containers/global/selectors";
import { useSelector } from "react-redux";
import { cn } from "../../../../../lib/utils";
import { onGoingOutpostSelectors } from "../../../selectors";
import { ConfettiContainer } from "./confettiContainer";
import { FollowUserButton } from "./FollowButton";
import { IsTalkingIndicator } from "./isTalkingIndicator";
import { MemberActions } from "./MemberActions";
import { MemberAvatar } from "./MemberAvatar";
import { MemberHeader } from "./MemberHeader";
import { MemberStatus } from "./MemberStatus";

interface MemberCardProps {
  address: string;
}

export const MemberCard = ({ address }: MemberCardProps) => {
  const member = useSelector(onGoingOutpostSelectors.member(address));
  if (!member) return null;
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isCurrentUser = address === myUser?.address;

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md relative",
        member.is_speaking && "bg-primary/5",
        isCurrentUser && "ring-2 ring-secondary/50"
      )}
    >
      <ConfettiContainer address={address} />

      {/* Follow button in top-right corner */}
      <div className="absolute bottom-12 right-4 z-20">
        <FollowUserButton member={member} />
      </div>

      {/* IsTalkingIndicator in top-right corner (below follow button) */}
      <div className="absolute top-2 right-2 z-10">
        <IsTalkingIndicator address={address} />
      </div>

      {/* Header with avatar and name */}
      <div className="flex items-center gap-3 mb-3">
        <MemberAvatar member={member} />
        <MemberHeader member={member} isCurrentUser={isCurrentUser} />
      </div>

      {/* Status and time info */}
      <MemberStatus address={address} />

      {/* Action buttons */}
      <MemberActions address={member.address} />
    </div>
  );
};
