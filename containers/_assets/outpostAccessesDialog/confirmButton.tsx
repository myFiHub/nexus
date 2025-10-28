import { Button } from "app/components/Button";
import { Loader } from "app/components/Loader";
import { useSelector } from "react-redux";
import { AssetsSelectors } from "../selectore";

export const ConfirmButton = ({
  onClick,
  outpostId,
}: {
  onClick: () => void;
  outpostId: string;
}) => {
  const loadingList = useSelector(
    AssetsSelectors.outpostPassSellersLoading(outpostId)
  );
  const accesses = useSelector(AssetsSelectors.accesses(outpostId));
  const { canEnter, canSpeak } = accesses;

  let buttonState = {
    label: "Confirm",
    variant: "outline",
    disabled: true,
  };

  if (canEnter && canSpeak) {
    buttonState.label = "Enter and Speak";
    buttonState.disabled = false;
  }

  if (canEnter && !canSpeak) {
    buttonState.label = "Enter Mute";
    buttonState.disabled = false;
  }
  if (!canEnter) {
    buttonState.label = "Buy 1 Pass";
    buttonState.disabled = true;
  }

  if (loadingList) {
    return (
      <Button variant="outline">
        <Loader className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      onClick={buttonState.disabled ? undefined : onClick}
      disabled={buttonState.disabled}
    >
      {buttonState.label}
    </Button>
  );
};
