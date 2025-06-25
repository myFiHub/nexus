"use client";
import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { getTimerInfo } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  useSelector(GlobalSelectors.tick);
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const loadingOutpost = useSelector(GlobalSelectors.joiningOutpostId);
  const isLoading = outpost.uuid == loadingOutpost;
  const scheduledForInMillis = outpost.scheduled_for;

  const { displayText, isPassed } = getTimerInfo(scheduledForInMillis);
  const iAmCreator = myUser?.uuid === outpost.creator_user_uuid;

  const handleOpenClick = () => {
    dispatch(globalActions.joinOutpost({ outpost }));
  };

  if (!myUser) {
    return <div className="h-8 w-full" />;
  }

  return (
    <div className="flex gap-2 mt-auto">
      <Button
        size="sm"
        colorScheme="primary"
        disabled={isLoading || (!isPassed && !iAmCreator)}
        className={`flex-1 text-xs ${
          !isPassed && !iAmCreator ? "opacity-50" : ""
        } ${!isPassed ? "bg-gray-500" : ""}`}
        onClick={handleOpenClick}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : displayText}
      </Button>
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
