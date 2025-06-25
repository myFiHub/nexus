import { GlobalSelectors } from "app/containers/global/selectors";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";

export const RemainingTimeText = ({ address }: { address: string }) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const remainingTime = useSelector(
    onGoingOutpostSelectors.remainingTime(address)
  );
  const outpost = useSelector(onGoingOutpostSelectors.outpost);
  const isCreator = myUser?.uuid === outpost?.creator_user_uuid;
  return <>{!isCreator ? remainingTime : "Creator"}</>;
};
