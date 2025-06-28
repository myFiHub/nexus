"use client";

import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { outpostDetailsActions, useOutpostDetailsSlice } from "./slice";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  useOutpostDetailsSlice();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(outpostDetailsActions.getOutpost(outpost.uuid));
  }, [outpost]);
  return <></>;
};

export const OutpostDetailsUpdater = ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
