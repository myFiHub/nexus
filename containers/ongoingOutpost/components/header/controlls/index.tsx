import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { HangupButton } from "./hangup_button";

export const Controlls = () => {
  const joined = useSelector(onGoingOutpostSelectors.joined);
  if (!joined) {
    return (
      <div className="bg-muted/50 backdrop-blur-sm border border-border rounded-xl px-4 py-3 min-w-[120px] flex items-center justify-center">
        <div className="text-sm text-muted-foreground font-medium">
          Joining...
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 min-w-[120px]">
      <HangupButton />
    </div>
  );
};
