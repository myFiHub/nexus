"use client";
import { LoginButton } from "app/components/header/LoginButton";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useOnGoingOutpostSlice } from "app/containers/ongoingOutpost/slice";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/Button";

interface JoinButtonProps {
  outpost: OutpostModel;
}

const JoinButtonContent = ({ outpost }: JoinButtonProps) => {
  useOnGoingOutpostSlice();
  const router = useRouter();
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const joiningId = useSelector(GlobalSelectors.joiningOutpostId);
  const joining = joiningId === outpost.uuid;
  if (!outpost) return null;
  const join = () => {
    dispatch(globalActions.joinOutpost(outpost));
  };

  if (!myUser && !logingIn) return <LoginButton className="w-full" />;
  const loading = joining || logingIn;
  return (
    <Button className="w-full" onClick={join} disabled={loading}>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        "Join Outpost"
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
