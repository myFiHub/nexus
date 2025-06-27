"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { BuyableTicketTypes } from "../../types";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const checkingOutpostForPass = useSelector(
    GlobalSelectors.checkingOutpostForPass
  );
  const loggingIn = useSelector(GlobalSelectors.logingIn);
  const [isClient, setIsClient] = useState(false);

  // Ensure consistent rendering between server and client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loading = checkingOutpostForPass?.uuid === outpost.uuid;
  const buyable =
    outpost.speak_type === BuyableTicketTypes.onlyPodiumPassHolders ||
    outpost.enter_type === BuyableTicketTypes.onlyPodiumPassHolders;

  const handleLockClick = () => {
    if (loggingIn) {
      return;
    }
    if (!buyable) {
      return;
    }
    if (!myUser) {
      toast.error("You must be logged in to check if you have a pass");
      dispatch(globalActions.getAndSetWeb3AuthAccount());
      return;
    }
    dispatch(globalActions.checkIfIHavePass({ outpost }));
  };

  // Always render the lock icon on server-side and during initial client render
  // Only show loading state after client-side hydration is complete
  const shouldShowLoading = isClient && (loading || loggingIn);

  return (
    <div className="cursor-pointer" onClick={handleLockClick}>
      {shouldShowLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Lock className="w-4 h-4 text-orange-500" />
      )}
    </div>
  );
};

export const LockActionIcon = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
