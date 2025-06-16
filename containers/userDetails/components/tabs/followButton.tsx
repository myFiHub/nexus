"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import podiumApi from "app/services/api";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Subscription } from "rxjs";
import { Button } from "../../../../components/Button";
import { followStateSubject } from "../../../../lib/messenger";
import { userDetailsActions } from "../../slice";

const Content = ({
  id,
  address,
  followed: initialFollowed,
}: {
  id: string;
  address: string;
  followed: boolean;
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [gettingUserData, setGettingUserData] = useState(false);
  const [followed, setFollowed] = useState(initialFollowed);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = myUser?.uuid === id;
  const isLoading = loading || gettingUserData;

  useEffect(() => {
    let subscription: Subscription;

    if (myUser && address !== myUser.address) {
      subscription = followStateSubject.subscribe((state) => {
        if (state.id === id) {
          if (state.loading !== undefined) {
            setLoading(state.loading);
          }
          if (state.followed !== undefined) {
            setFollowed(state.followed);
          }
        }
      });
      const getUserData = async () => {
        setGettingUserData(true);
        const areFollowedByMe = await podiumApi.areFollowedByMe([address]);
        setGettingUserData(false);
        setFollowed(areFollowedByMe[address] || false);
      };
      getUserData();
    }

    return () => subscription?.unsubscribe();
  }, [address, myUser]);

  const handleFollowUnfollowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(
      userDetailsActions.followUnfollowUser({
        id: id,
        follow: !followed,
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
      colorScheme={followed ? "danger" : "primary"}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : followed ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
export const FollowButton = ({
  id,
  followed,
  address,
}: {
  id: string;
  followed: boolean;
  address: string;
}) => {
  return (
    <ReduxProvider>
      <Content id={id} followed={followed} address={address} />
    </ReduxProvider>
  );
};
