"use client";

import { GlobalSelectors } from "app/containers/global/selectors";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Subject } from "rxjs";
import { cohostsViewDialog, CohostsViewDialogProvider } from "./CohostsDialog";

interface CohostsProps {
  outpost?: OutpostModel;
}

export const cohostsNumberSubject = new Subject<string[]>();

const Content = ({ outpost }: CohostsProps) => {
  const cohosts = outpost?.cohost_user_uuids || [];
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const iAmCreator = outpost?.creator_user_uuid === myUser?.uuid;
  const [cohostsArray, setCohostsArray] = useState(cohosts || []);

  useEffect(() => {
    const subscription = cohostsNumberSubject.subscribe((cohosts) => {
      setCohostsArray(cohosts);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if ((!cohosts || cohosts.length === 0) && !iAmCreator) return null;

  const handleClick = async () => {
    if (!outpost?.uuid) return;

    await cohostsViewDialog({
      title: "Cohosts",
      cohostUuids: cohostsArray,
      iAmCreator,
      outpostUuid: outpost.uuid,
    });
  };

  return (
    <>
      <CohostsViewDialogProvider />
      <button
        onClick={handleClick}
        className="text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer font-medium hover:underline"
      >
        {cohostsArray.length} Cohost{cohostsArray.length !== 1 ? "s" : ""}
      </button>
    </>
  );
};

export const Cohosts = ({ outpost }: CohostsProps) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
