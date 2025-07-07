"use client";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { globalActions } from "../global/slice";
import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "../ongoingOutpost/slice";
import { outpostDetailsActions, useOutpostDetailsSlice } from "./slice";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  useOutpostDetailsSlice();
  useOnGoingOutpostSlice();
  useEffect(() => {
    dispatch(outpostDetailsActions.setOutpost(outpost));
    dispatch(onGoingOutpostActions.setOutpost(outpost));
    dispatch(outpostDetailsActions.getOutpost(outpost.uuid));
    // return () => {
    //   dispatch(outpostDetailsActions.setOutpost(undefined));
    // };
  }, [outpost.uuid]);
  return <></>;
};

export const StateInitializer = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
