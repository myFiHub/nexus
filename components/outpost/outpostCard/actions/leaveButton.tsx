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
          className="bg-red-500 hover:bg-red-600"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Leave the Outpost</TooltipContent>
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
