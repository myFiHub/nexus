"use client";
import { usersActions, useUsersSlice } from "app/containers/_users/slice";
import { GlobalSelectors } from "app/containers/global/selectors";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { ReduxProvider } from "app/store/Provider";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Subscription } from "rxjs";
import { Button, ButtonProps } from "../../../../components/Button";
import { followStateSubject } from "../../../../lib/messenger";
import { usersSelectors } from "../../selectors";

const Content = ({
  id,
  address,
  followed: initialFollowed,
  size,
  className,
}: {
  id: string;
  address: string;
  followed: boolean;
  size?: ButtonProps["size"];
  className?: string;
}) => {
  useUsersSlice();
  const dispatch = useDispatch();
  const isFollowedFromCache = useSelector(
    usersSelectors.isFollowedFromCache(id)
  );
  const initial =
    isFollowedFromCache === undefined ? initialFollowed : isFollowedFromCache;
  const existsOnCache = isFollowedFromCache !== undefined;
  const [loading, setLoading] = useState(false);
  const [gettingUserData, setGettingUserData] = useState(false);
  const [followed, setFollowed] = useState(initial);
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
        if (existsOnCache) {
          return;
        }
        setGettingUserData(true);
        const areFollowedByMe = await podiumApi.areFollowedByMe([address]);
        setGettingUserData(false);
        setFollowed(areFollowedByMe[address] || false);
        dispatch(
          usersActions.updateFollowStatusCache({
            id: id,
            follow: areFollowedByMe[address] || false,
          })
        );
      };
      getUserData();
    }

    return () => subscription?.unsubscribe();
  }, [address, myUser, existsOnCache]);

  const handleFollowUnfollowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(
      usersActions.followUnfollowUser({
        id: id,
        follow: !followed,
      })
    );
  };
  if (isMyUser || !myUser) {
    return <></>;
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ overflow: "hidden" }}
      >
        <Button
          variant="outline"
          size={size}
          onClick={handleFollowUnfollowClick}
          disabled={isLoading}
          className={cn("min-w-22", className)}
          colorScheme={followed ? "danger" : "primary"}
        >
          {isLoading ? (
            <div className="h-5 flex items-center justify-center">
              <Loader2 className="animate-spin" size={15} />
            </div>
          ) : followed ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
export const FollowButton = ({
  id,
  followed,
  address,
  size = "sm",
  className,
}: {
  id: string;
  followed: boolean;
  address: string;
  size?: ButtonProps["size"];
  className?: string;
}) => {
  return (
    <ReduxProvider>
      <Content
        id={id}
        followed={followed}
        address={address}
        size={size}
        className={className}
      />
    </ReduxProvider>
  );
};
