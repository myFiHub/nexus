"use client";
import { OutpostModel } from "app/services/api/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "../ongoingOutpost/slice";
import { outpostDetailsActions, useOutpostDetailsSlice } from "./slice";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  useOutpostDetailsSlice();
  useOnGoingOutpostSlice();
  useEffect(() => {
    dispatch(outpostDetailsActions.setOutpost(outpost));
    dispatch(onGoingOutpostActions.setOutpost(outpost));

    // return () => {
    //   dispatch(outpostDetailsActions.setOutpost(undefined));
    // };
  }, [outpost.uuid]);

  const myUuid = myUser?.uuid;
  // The response carries viewer-specific fields (my_ban, i_am_member), so refetch when the viewer changes.
  useEffect(() => {
    dispatch(outpostDetailsActions.getOutpost(outpost.uuid));
  }, [myUuid, outpost.uuid, dispatch]);

  return <></>;
};

export const StateInitializer = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <>
      <Content outpost={outpost} />
    </>
  );
};
