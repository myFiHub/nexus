"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { FollowerModel, PodiumPassBuyerModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../components/Button";
import { userDetailsSelectors } from "../../selectors";
import { userDetailsActions } from "../../slice";

const Content = ({ user }: { user: FollowerModel | PodiumPassBuyerModel }) => {
  const dispatch = useDispatch();
  const followedByMe = useSelector(
    userDetailsSelectors.followedByMe(user.uuid)
  );
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = myUser?.uuid === user.uuid;
  const loadingFollowUnfollowId = useSelector(
    userDetailsSelectors.loadingFollowUnfollowId
  );
  const isLoading = loadingFollowUnfollowId === user.uuid;
  const handleFollowUnfollowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(
      userDetailsActions.followUnfollowUser({
        id: user.uuid,
        follow: !followedByMe,
      })
    );
  };
  if (isMyUser || !myUser) {
    return <></>;
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFollowUnfollowClick}
      disabled={isLoading}
      className="min-w-22"
      colorScheme={followedByMe ? "danger" : "primary"}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : followedByMe ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
export const FollowButton = ({
  user,
}: {
  user: FollowerModel | PodiumPassBuyerModel;
}) => {
  return (
    <ReduxProvider>
      <Content user={user} />
    </ReduxProvider>
  );
};
