"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { JoinButton } from "app/containers/outpostDetails/components/JoinButton";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  if (!myUser) {
    return <div className="h-8 w-full" />;
  }

  return (
    <div className="flex gap-2 mt-auto">
      <JoinButton outpost={outpost} />
    </div>
  );
};

export const OutpostCardActions = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
