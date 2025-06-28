"use client";
import { LoginButton } from "app/components/header/LoginButton";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useOnGoingOutpostSlice } from "app/containers/ongoingOutpost/slice";
import { getTimerInfo } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { outpostDetailsSelectors } from "../selectors";

interface JoinButtonProps {
  outpost: OutpostModel;
}

const JoinButtonContent = ({ outpost: passedOutpost }: JoinButtonProps) => {
  useOnGoingOutpostSlice();
  useSelector(GlobalSelectors.tick);
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const joiningId = useSelector(GlobalSelectors.joiningOutpostId);
  const stateOutpost = useSelector(outpostDetailsSelectors.outpost);
  const outpost = stateOutpost || passedOutpost;
  const joining = joiningId === outpost.uuid;
  const { displayText, isPassed } = getTimerInfo(outpost.scheduled_for);
  const iAmCreator = myUser?.uuid === outpost.creator_user_uuid;
  if (!outpost) return null;
  const join = () => {
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
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        displayText
      )}
    </Button>
  );
};

export function JoinButton({ outpost }: JoinButtonProps) {
  return (
    <ReduxProvider>
      <JoinButtonContent outpost={outpost} />
    </ReduxProvider>
  );
}
