"use client";
import { usersActions, useUsersSlice } from "app/containers/_users/slice";
import { GlobalSelectors } from "app/containers/global/selectors";
import { cn } from "app/lib/utils";
import podiumApi from "app/services/api";
import { ReduxProvider } from "app/store/Provider";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  noRouterRefresh,
}: {
  id: string;
  address: string;
  followed: boolean;
  size?: ButtonProps["size"];
  className?: string;
  noRouterRefresh?: boolean;
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
  const [gettingUserData, setGettingUserData] = useState(true);
  const [followed, setFollowed] = useState(initial);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = myUser?.uuid === id;
  const isLoading = loading || gettingUserData;
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => observer.disconnect();
  }, [myUser]);

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
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [address, myUser, id]);

  useEffect(() => {
    if (myUser && address !== myUser.address && isVisible && !existsOnCache) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const getUserData = async () => {
        timeoutRef.current = setTimeout(async () => {
          if (!isVisibleRef.current) {
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
        }, 500);
      };
      getUserData();
    } else if (!isVisible && timeoutRef.current) {
      // Clear timeout when component becomes invisible
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [address, myUser, existsOnCache, id, dispatch, isVisible]);

  const handleFollowUnfollowClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(
      usersActions.followUnfollowUser({
        id: id,
        follow: !followed,
        noRouterRefresh,
      })
    );
  };
  if (isMyUser || !myUser) {
    return <></>;
  }
  return (
    <div ref={componentRef}>
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
    </div>
  );
};
export const FollowButton = ({
  id,
  followed,
  address,
  size = "sm",
  className,
  noRouterRefresh,
}: {
  id: string;
  followed: boolean;
  address: string;
  size?: ButtonProps["size"];
  className?: string;
  noRouterRefresh?: boolean;
}) => {
  return (
    <ReduxProvider>
      <Content
        id={id}
        followed={followed}
        address={address}
        size={size}
        className={className}
        noRouterRefresh={noRouterRefresh}
      />
    </ReduxProvider>
  );
};
