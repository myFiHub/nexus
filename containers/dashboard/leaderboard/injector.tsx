"use client";

import { LeaderboardTags } from "app/app/(unauthenticated)/dashboard/@leaderboard/_configs";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaderboardActions, injectLeaderboardSlice } from "./slice";

const Content = () => {
  const dispatch = useDispatch();
  injectLeaderboardSlice();

  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    if (myUser?.aptos_address) {
      dispatch(
        leaderboardActions.getCurrentUserRank({
          filter: LeaderboardTags.TopFeeEarned,
        })
      );
      dispatch(
        leaderboardActions.getCurrentUserRank({
          filter: LeaderboardTags.MostPassHeld,
        })
      );
      dispatch(
        leaderboardActions.getCurrentUserRank({
          filter: LeaderboardTags.MostUniquePassHolders,
        })
      );
    }
  }, [myUser?.aptos_address]);
  return null;
};

export const LeaderboardInjector = () => {
  return (
    <>
      <Content />
    </>
  );
};
