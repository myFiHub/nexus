import { GlobalSelectors } from "app/containers/global/selectors";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";

export const MyTimer = ({ id }: { id?: string }) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const myRemainingTime = useSelector(
    onGoingOutpostSelectors.remainingTime(myUser?.address)
  );
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const iAmCreator = myUser?.uuid === outpost?.creator_user_uuid;

  // Convert time string (HH:MM:SS) to total seconds
  const getTimeInSeconds = (timeString: string | number) => {
    if (!timeString || timeString === "00:00:00" || timeString === 0) return 0;
    if (typeof timeString === "number") return timeString;

    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) {
      // HH:MM:SS format
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      // MM:SS format
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const timeInSeconds = getTimeInSeconds(myRemainingTime);
  const isLessThanOneMinute = timeInSeconds > 0 && timeInSeconds < 60;

  return (
    <div
      id={id}
      className={`px-4 py-3 ${isLessThanOneMinute ? "animate-pulse" : ""}`}
    >
      <div className="text-center">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          {!iAmCreator ? "Remaining Time" : ""}
        </div>
        <div
          className={`text-lg sm:text-xl lg:text-2xl font-mono font-bold ${
            isLessThanOneMinute ? "text-red-500" : "text-foreground"
          }`}
        >
          {iAmCreator ? "Creator" : myRemainingTime || "00:00:00"}
        </div>
      </div>
    </div>
  );
};
