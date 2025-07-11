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
  joinComponent?: React.ReactNode;
}

const JoinButtonContent = ({
  outpost: passedOutpost,
  fromCard,
  joinComponent,
}: JoinButtonProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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

  const join = () => {
    if (wsConnectionStatus.state !== ConnectionState.CONNECTED) {
      toast.error("Please check your connection and try again");
      return;
    }
    dispatch(globalActions.joinOutpost({ outpost }));
  };

  if (!outpost) return null;

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <Button className="w-full" disabled>
        <span className="font-medium">Loading...</span>
      </Button>
    );
  }

  // Client-side only logic
  const joining = joiningId === outpost.uuid;
  const timerInfo = getTimerInfo(outpost.scheduled_for);
  const { displayText, isPassed } = timerInfo;
  const iAmCreator = myUser?.uuid === outpost.creator_user_uuid;

  if (!myUser && !logingIn) return <LoginButton className="w-full" />;

  const loading = joining || logingIn;
  const disabled = iAmCreator ? loading : !isPassed || loading;

  return (
    <Button className="w-full" onClick={join} disabled={disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{joining ? "Joining..." : "Loading..."}</span>
        </div>
      ) : (
        joinComponent ?? <span className="font-medium">{displayText}</span>
      )}
    </Button>
  );
};

export function JoinButton({ outpost, fromCard, joinComponent }: JoinButtonProps) {
  return (
    <ReduxProvider>
      <JoinButtonContent
        outpost={outpost}
        fromCard={fromCard}
        joinComponent={joinComponent}
      />
    </ReduxProvider>
  );
}
