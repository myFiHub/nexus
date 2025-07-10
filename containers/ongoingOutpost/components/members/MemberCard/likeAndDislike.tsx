import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { onGoingOutpostActions } from "app/containers/ongoingOutpost/slice";
import { cn } from "app/lib/utils";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Circular Progress Component
const CircularProgress = ({
  progress,
  size = 24,
  strokeWidth = 2,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-green-600 transition-all duration-100 ease-linear"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {children}
      </div>
    </div>
  );
};

export const LikeAndDislike = ({
  like,
  address,
}: {
  like: boolean;
  address: string;
}) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = myUser?.address === address;

  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [acted, setActed] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
      setActed(false);
    }
  }, [countdown, isDisabled]);

  const handleLike = () => {
    if (isDisabled) return;

    dispatch(onGoingOutpostActions.like({ targetUserAddress: address }));
    setIsDisabled(true);
    setActed(true);
    setCountdown(10);
  };

  const handleDislike = () => {
    if (isDisabled) return;

    dispatch(onGoingOutpostActions.dislike({ targetUserAddress: address }));
    setIsDisabled(true);
    setActed(true);
    setCountdown(10);
  };

  if (isMyUser) return null;

  const progress = ((10 - countdown) / 10) * 100;
  const isActive = isDisabled && acted;

  return (
    <Button
      onClick={like ? handleLike : handleDislike}
      disabled={isDisabled}
      size="xs"
      className={cn(
        "flex-1 flex items-center justify-center gap-1 p-2 text-xs rounded transition-colors",
        like
          ? "bg-green-500/10 hover:bg-green-500/20 text-green-600 disabled:opacity-50"
          : "bg-red-500/10 hover:bg-red-500/20 text-red-600 disabled:opacity-50"
      )}
      title={like ? "Like" : "Dislike"}
    >
      {isActive ? (
        <CircularProgress progress={progress} size={20} strokeWidth={2}>
          {countdown}
        </CircularProgress>
      ) : like ? (
        <ThumbsUp className="w-3 h-3" />
      ) : (
        <ThumbsDown className="w-3 h-3" />
      )}
    </Button>
  );
};
