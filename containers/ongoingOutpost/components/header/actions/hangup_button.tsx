import { Button } from "app/components/Button";
import { leaveOutpostWarningDialog } from "app/containers/ongoingOutpost/dialogs/leaveOutpostWarning";
import { Loader2, PhoneOff } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";

export const HangupButton = () => {
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const onlineMembersCount = useSelector(onGoingOutpostSelectors.membersCount);
  const [isHangingUp, setIsHangingUp] = useState(false);

  const handleHangup = async () => {
    if (apiObj && outpost) {
      setIsHangingUp(true);
      const shouldLeave = await leaveOutpostWarningDialog({
        outpostName: outpost.name,
        onlineMembersCount: onlineMembersCount || 0,
      });
      if (shouldLeave) {
        apiObj.executeCommand("hangup");
      } else {
        setIsHangingUp(false);
      }
    }
  };

  return (
    <Button
      onClick={handleHangup}
      variant="destructive"
      className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl min-w-[108px]"
    >
      {isHangingUp ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <PhoneOff className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">Hangup</span>
    </Button>
  );
};
