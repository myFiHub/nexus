"use client";
import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const loadingOutpost = useSelector(GlobalSelectors.joiningOutpostId);
  const isLoading = outpost.uuid == loadingOutpost;

  const handleOpenClick = () => {
    dispatch(globalActions.joinOutpost(outpost));
  };

  if (!myUser) {
    return <div className="h-8 w-full" />;
  }
  return (
    <div className="flex gap-2 mt-auto">
      <Button
        size="sm"
        colorScheme="primary"
        disabled={isLoading}
        className="flex-1 text-xs"
        onClick={handleOpenClick}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Open"}
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
