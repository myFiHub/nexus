"use client";

import { Button } from "app/components/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "app/components/Tooltip";
import { GlobalSelectors } from "app/containers/global/selectors";
import {
  myOutpostsActions,
  useMyOutpostsSlice,
} from "app/containers/myOutposts/slice";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { revalidateService } from "app/services/revalidate";
import { ReduxProvider } from "app/store/Provider";
import { ArchiveRestore, ArchiveX } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Content = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  useMyOutpostsSlice();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const showArchivedOutposts = useSelector(
    GlobalSelectors.viewArchivedOutposts
  );
  const amICreator = myUser?.uuid === outpost.creator_user_uuid;
  const [isArchivedState, setIsArchivedState] = useState(outpost.is_archived);
  const [isLoading, setIsLoading] = useState(false);

  if (!amICreator || !myUser) {
    return null;
  }

  const handleArchive = async () => {
    setIsLoading(true);
    const shouldArchive = !isArchivedState;
    const result = await podiumApi.toggleOutpostArchive(
      outpost.uuid,
      shouldArchive
    );
    if (result) {
      toast.success(
        shouldArchive
          ? "Outpost successfully archived"
          : "Outpost successfully unarchived"
      );
      if (shouldArchive && !showArchivedOutposts) {
        dispatch(myOutpostsActions.removeOutpost(outpost.uuid));
      }
      revalidateService.revalidateMultiple({
        outpostId: outpost.uuid,
      });
      setIsArchivedState(!isArchivedState);
    }
    setIsLoading(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleArchive}
          disabled={isLoading}
          className={`w-10 h-10 p-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-60 ${
            !isArchivedState
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          }`}
        >
          {isArchivedState ? (
            <ArchiveX className="w-4 h-4" />
          ) : (
            <ArchiveRestore className="w-4 h-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-foreground">
        {isArchivedState ? "Unarchive the Outpost" : "Archive the Outpost"}
      </TooltipContent>
    </Tooltip>
  );
};

export const ArchiveButton = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
