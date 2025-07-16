import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { GlobalSelectors } from "app/containers/global/selectors";
import { Hand } from "lucide-react";
import { Button } from "app/components/Button";

export const RaiseHand = () => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isHandRaised = useSelector(
    onGoingOutpostSelectors.isHandRaised(myUser?.address)
  );
  const apiObj = useSelector(onGoingOutpostSelectors.meetApiObj);
  const handleRaiseHand = () => {
    if (apiObj) {
      apiObj.executeCommand("raiseHand");
    }
  };
  if (isHandRaised) {
    return null;
  }
  return (
    <Button onClick={() => {}}>
      <Hand className="w-4 h-4" />
      Raise Hand
    </Button>
  );
};
