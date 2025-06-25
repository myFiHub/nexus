import { Mic } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";

export const IsTalkingIndicator = ({ address }: { address: string }) => {
  const isTalking = useSelector(onGoingOutpostSelectors.isTalking(address));

  if (!isTalking) return null;

  return (
    <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full animate-pulse">
      <Mic className="w-3 h-3 text-white" />
    </div>
  );
};
