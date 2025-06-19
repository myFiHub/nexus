"use client";
import { OutpostModel } from "app/services/api/types";
import { useEffect } from "react";
import {
  onGoingOutpostActions,
  useOnGoingOutpostSlice,
} from "../ongoingOutpost/slice";
import { outpostDetailsActions, useOutpostDetailsSlice } from "./slice";

export const StateInitializer = ({ outpost }: { outpost: OutpostModel }) => {
  useOutpostDetailsSlice();
  useOnGoingOutpostSlice();
  useEffect(() => {
    outpostDetailsActions.setOutpost(outpost);
    onGoingOutpostActions.setOutpost(outpost);
  }, [outpost.uuid]);
  return <></>;
};
