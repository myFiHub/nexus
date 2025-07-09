import { InviteUsersButton } from "app/containers/outpostDetails/components/InviteUsersButton";
import { wsClient } from "app/services/wsClient/client";
import { Loader2, Users } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { onGoingOutpostActions } from "../../slice";
import { MembersList } from "./list";

export const OngoingOutpostMembers = memo(
  () => {
    const dispatch = useDispatch();
    const numberOfMembers = useSelector(onGoingOutpostSelectors.membersCount);
    const isGettingLiveMembers = useSelector(
      onGoingOutpostSelectors.isGettingLiveMembers
    );
    const outpost = useSelector(onGoingOutpostSelectors.outpost);
    const numberOfMembersRef = useRef(numberOfMembers);

    useEffect(() => {
      numberOfMembersRef.current = numberOfMembers;
    }, [numberOfMembers]);

    useEffect(() => {
      if (outpost?.uuid) {
        setTimeout(async () => {
          if (numberOfMembersRef.current === 0) {
            // const joinedOutpostId=wsClient.
            const success = await wsClient.asyncJoinOutpost(outpost?.uuid);
            if (success) {
              dispatch(onGoingOutpostActions.getLiveMembers());
            }
          }
        }, 5000);
      }
    }, [outpost?.uuid]);

    // Fetch live members when component mounts
    useEffect(() => {
      if (outpost?.uuid) {
        dispatch(onGoingOutpostActions.getLiveMembers());
      }
      //after 5 seconds, if livemembers length is 0, join again
    }, [dispatch, outpost?.uuid]);

    // Show loading state when getting live members
    if (isGettingLiveMembers || numberOfMembers === 0) {
      return (
        <div className="absolute top-0 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-[360px] w-[360px] max-h-[calc(100%-32px)] overflow-hidden z-50">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Live Members</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading members...</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute top-0 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-[360px] w-[360px] max-h-[calc(100%-32px)] overflow-hidden z-50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">
              Live Members ({numberOfMembers})
            </h3>
          </div>
          {outpost && (
            <InviteUsersButton
              outpost={outpost}
              withWrapper={false}
              buttonSize="xxs"
            />
          )}
        </div>
        <div className="overflow-y-auto max-h-[calc(100%-60px)]">
          <MembersList />
        </div>
      </div>
    );
  },
  () => true
);
