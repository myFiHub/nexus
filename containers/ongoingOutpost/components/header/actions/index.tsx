import { Loader } from "app/components/Loader";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { HangupButton } from "./hangup_button";

export const Controlls = () => {
  const joined = useSelector(onGoingOutpostSelectors.joined);
  if (!joined) {
    return <Loader className="w-4 h-4 animate-spin" />;
  }
  return (
    <div className="flex gap-3 min-w-[120px]">
      <HangupButton />
    </div>
  );
};
