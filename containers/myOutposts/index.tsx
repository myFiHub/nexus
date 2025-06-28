"use client";

import { LoginButton } from "app/components/header/LoginButton";
import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import { InfiniteScrollOutpostsList } from "./InfiniteScrollOutpostsList";
import { myOutpostsSelectors } from "./selectors";
import { myOutpostsActions, useMyOutpostsSlice } from "./slice";

const Content = () => {
  const dispatch = useDispatch();
  useMyOutpostsSlice();
  const isLoadingOutposts = useSelector(myOutpostsSelectors.isLoadingOutposts);
  const errorLoadingOutposts = useSelector(
    myOutpostsSelectors.errorLoadingOutposts
  );
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    if (myUser) {
      dispatch(myOutpostsActions.getOutposts());
    }
  }, [myUser]);

  if (!myUser) {
    return (
      <div className="flex justify-center items-center h-full pt-24">
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-24">
      <h1 className="text-2xl font-bold">My Outposts</h1>

      <InfiniteScrollOutpostsList />
    </div>
  );
};

export const MyOutposts = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
