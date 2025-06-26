import { Button } from "app/components/Button";
import { PhoneOff } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";

export const HangupButton = () => {
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const handleHangup = () => {
    if (apiObj) {
      apiObj.executeCommand("hangup");
    }
  };

  return (
    <Button
      onClick={handleHangup}
      colorScheme="danger"
      className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl min-w-[108px]"
    >
      <PhoneOff className="w-4 h-4" />
      <span className="hidden sm:inline">Hangup</span>
    </Button>
  );
};
