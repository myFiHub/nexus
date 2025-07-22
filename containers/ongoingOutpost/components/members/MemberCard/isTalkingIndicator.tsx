import { Mic } from "lucide-react";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";

export const IsTalkingIndicator = ({ address }: { address: string }) => {
  const isTalking = useSelector(onGoingOutpostSelectors.isTalking(address));
  if (!isTalking) return null;

  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      {/* Pulsing outline rings */}
      <div className="absolute w-3 h-3 rounded-full border border-emerald-400 pulse-ring"></div>
      <div className="absolute w-3 h-3 rounded-full border border-emerald-400 pulse-ring-delayed"></div>

      {/* Outer glowing circle */}
      <div className="absolute w-6 h-6 rounded-full bg-emerald-500 shadow-[0px_0px_8px_#10b981]"></div>

      {/* Inner circle */}
      <div className="absolute w-5 h-5 rounded-full bg-emerald-400 shadow-[0px_-1px_2px_#34d399] flex items-center justify-center">
        <Mic className="w-3 h-3 text-white" />
      </div>
    </div>
  );
};
