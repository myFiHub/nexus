import { Button } from "app/components/Button";
import { confirmDialog } from "app/components/Dialog/confirmDialog";
import { Loader2, PhoneOff } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";

export const HangupButton = () => {
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const [isHangingUp, setIsHangingUp] = useState(false);
  const handleHangup = async () => {
    if (apiObj) {
      setIsHangingUp(true);
      const response = await confirmDialog({
        title: "Leavint the outpost",
        content: "Do you want to leave the outpost?",
        confirmOpts: {
          text: "LEAVE",
          colorScheme: "danger",
        },
      });
      if (response.confirmed) {
        apiObj.executeCommand("hangup");
      } else {
        setIsHangingUp(false);
      }
    }
  };

  return (
    <Button
      onClick={handleHangup}
      colorScheme="danger"
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
