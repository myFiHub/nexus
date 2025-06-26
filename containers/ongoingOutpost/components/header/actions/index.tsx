import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { HangupButton } from "./hangup_button";

export const Controlls = () => {
  const joined = useSelector(onGoingOutpostSelectors.joined);
  if (!joined) {
    return <div />;
  }
  return (
    <div className="flex gap-3 min-w-[120px]">
      <HangupButton />
    </div>
  );
};
