import { OutpostModel } from "app/services/api/types";
import { outpostDetailsActions, useOutpostDetailsSlice } from "./slice";
import { useEffect } from "react";

export const StateInitializer = async ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  useOutpostDetailsSlice();
  useEffect(() => {
    outpostDetailsActions.setOutpost(outpost);
  }, [outpost]);
  return <></>;
};
