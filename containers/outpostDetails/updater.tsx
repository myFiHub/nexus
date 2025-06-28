"use client";

import { OutpostModel } from "app/services/api/types";
import { outpostDetailsActions } from "./slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(outpostDetailsActions.getOutpost(outpost.uuid));
  }, [outpost]);
  return <></>;
};
