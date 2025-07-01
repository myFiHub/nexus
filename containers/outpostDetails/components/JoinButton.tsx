"use client";
import { LoginButton } from "app/components/header/LoginButton";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useOnGoingOutpostSlice } from "app/containers/ongoingOutpost/slice";
import { toast } from "app/lib/toast";
import { getTimerInfo } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { ConnectionState } from "app/services/wsClient";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { outpostDetailsSelectors } from "../selectors";

interface JoinButtonProps {
  outpost: OutpostModel;
  fromCard?: boolean;
}

const JoinButtonContent = ({
  outpost: passedOutpost,
  fromCard,
}: JoinButtonProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useOnGoingOutpostSlice();
  useSelector(GlobalSelectors.tick);
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const joiningId = useSelector(GlobalSelectors.joiningOutpostId);
  const stateOutpost = useSelector(outpostDetailsSelectors.outpost);
  const wsConnectionStatus = useSelector(GlobalSelectors.wsConnectionStatus);
  const outpost = (fromCard ? passedOutpost : stateOutpost) || passedOutpost;
  const joining = joiningId === outpost.uuid;

  // Only calculate timer info after mounting to prevent hydration mismatch
  const timerInfo = isMounted
    ? getTimerInfo(outpost.scheduled_for)
    : { displayText: "Loading...", isPassed: false };
  const { displayText, isPassed } = timerInfo;

  const iAmCreator = myUser?.uuid === outpost.creator_user_uuid;
  if (!outpost) return null;
  const join = () => {
    if (wsConnectionStatus.state !== ConnectionState.CONNECTED) {
      toast.error("Please check your connection and try again");
      return;
    }
    dispatch(globalActions.joinOutpost({ outpost }));
  };

  if (!myUser && !logingIn) return <LoginButton className="w-full" />;
  const loading = joining || logingIn;

  const disabledIfIAmCreator = loading;
  const disabledIfImNotCreator = !isPassed || loading;

  return (
    <Button
      className={`w-full text-center`}
      onClick={join}
      disabled={iAmCreator ? disabledIfIAmCreator : disabledIfImNotCreator}
    >
      {loading && isMounted ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        displayText
      )}
    </Button>
  );
};

export function JoinButton({ outpost, fromCard }: JoinButtonProps) {
  return (
    <ReduxProvider>
      <JoinButtonContent outpost={outpost} fromCard={fromCard} />
    </ReduxProvider>
  );
}
