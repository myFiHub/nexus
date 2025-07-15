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
import { ReduxProvider } from "app/store/Provider";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Content = ({ outpost: passedOutpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  useMyOutpostsSlice();
  const [outpost, setOutpost] = useState(passedOutpost);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const amICreator = myUser?.uuid === outpost.creator_user_uuid;
  const amIMember = outpost.i_am_member;
  const [isLoading, setIsLoading] = useState(false);
  if ((!!myUser && amICreator) || !amIMember) {
    return null;
  }

  const handleLeave = async () => {
    setIsLoading(true);
    const result = await podiumApi.leaveOutpost(outpost.uuid);
    if (result) {
      setOutpost({
        ...outpost,
        members: outpost.members?.filter(
          (member) => member.uuid !== myUser?.uuid
        ),
        i_am_member: false,
      });
      toast.success("You have left the outpost");
      dispatch(myOutpostsActions.removeOutpost(outpost.uuid));
    }
    setIsLoading(false);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleLeave}
          disabled={isLoading}
          className="w-10 h-10 p-0 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-foreground">
        Leave the Outpost
      </TooltipContent>
    </Tooltip>
  );
};

export const LeaveButton = ({ outpost }: { outpost: OutpostModel }) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} />
    </ReduxProvider>
  );
};
