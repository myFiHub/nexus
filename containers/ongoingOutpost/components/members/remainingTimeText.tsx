import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";

export const RemainingTimeText = ({ address }: { address: string }) => {
  const remainingTime = useSelector(
    onGoingOutpostSelectors.remainingTime(address)
  );
  return <>{remainingTime}</>;
};
