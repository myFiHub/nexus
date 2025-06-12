"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { User } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsActions, useUserDetailsSlice } from "../../slice";

const Content = ({ user }: { user: User }) => {
  useUserDetailsSlice();
  const dispatch = useDispatch();
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  useEffect(() => {
    if (loggedIn) {
      dispatch(userDetailsActions.getTabsData({ id: user.uuid }));
    }
  }, [user.uuid, loggedIn]);
  return <></>;
};

export const FollowFetcher = ({ user }: { user: User }) => {
  return (
    <ReduxProvider>
      <Content user={user} />
    </ReduxProvider>
  );
};
