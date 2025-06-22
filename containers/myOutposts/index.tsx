"use client";

import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { myOutpostsActions, useMyOutpostsSlice } from "./slice";

const Content = () => {
  useMyOutpostsSlice();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(myOutpostsActions.getOutposts());
  }, []);

  return <div>MyOutposts</div>;
};

export const MyOutposts = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
