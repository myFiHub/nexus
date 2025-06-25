import { GlobalSelectors } from "app/containers/global/selectors";
import { Clock, Heart, ThumbsDown, ThumbsUp, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Img } from "../../../../components/Img";
import { logoUrl } from "../../../../lib/constants";
import { cn } from "../../../../lib/utils";
import { onGoingOutpostSelectors } from "../../selectors";
import { onGoingOutpostActions } from "../../slice";
import { IsTalkingIndicator } from "./isTalkingIndicator";
import { RemainingTimeText } from "./remainingTimeText";

interface MemberCardProps {
  address: string;
}

export const MemberCard = ({ address }: MemberCardProps) => {
  const dispatch = useDispatch();
  const member = useSelector(onGoingOutpostSelectors.member(address));
  if (!member) return null;
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isCurrentUser = address === myUser?.address;

  const handleLike = () => {
    dispatch(onGoingOutpostActions.like({ targetUserAddress: member.address }));
  };

  const handleDislike = () => {
    dispatch(
      onGoingOutpostActions.dislike({ targetUserAddress: member.address })
    );
  };

  const handleCheer = () => {
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: true }));
  };

  const handleBoo = () => {
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: false }));
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md relative",
        member.is_speaking && "ring-2 ring-primary/50 bg-primary/5",
        isCurrentUser && "ring-2 ring-secondary/50"
      )}
    >
      {/* IsTalkingIndicator in top-right corner */}
      <div className="absolute top-2 right-2 z-10">
        <IsTalkingIndicator address={address} />
      </div>

      {/* Header with avatar and name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <Img
            src={member.image || logoUrl}
            alt={member.name}
            className="w-12 h-12 rounded-full border-2 border-primary/20"
          />
          {member.is_speaking && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          )}
          {!member.is_present && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">
              {member.name}
              {isCurrentUser && " (You)"}
            </h3>
            {member.is_recording && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Status and time info */}
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        {member.remaining_time > 0 ? (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              <RemainingTimeText address={address} />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500">
            <Clock className="w-3 h-3" />
            <span>Time is up!</span>
          </div>
        )}
      </div>

      {/* Reaction counts */}

      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 text-green-500" />
        </div>

        <div className="flex items-center gap-1">
          <ThumbsDown className="w-3 h-3 text-red-500" />
        </div>

        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-500" />
        </div>

        <div className="flex items-center gap-1">
          <XCircle className="w-3 h-3 text-orange-500" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-1">
        <button
          onClick={handleLike}
          className="flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded transition-colors"
          title="Like"
        >
          <ThumbsUp className="w-3 h-3" />
        </button>
        <button
          onClick={handleDislike}
          className="flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded transition-colors"
          title="Dislike"
        >
          <ThumbsDown className="w-3 h-3" />
        </button>
        <button
          onClick={handleCheer}
          className="flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 rounded transition-colors"
          title="Cheer"
        >
          <Heart className="w-3 h-3" />
        </button>
        <button
          onClick={handleBoo}
          className="flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 rounded transition-colors"
          title="Boo"
        >
          <XCircle className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
