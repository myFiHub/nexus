import { Loader2, Users } from "lucide-react";
import { memo, useEffect } from "react";
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

    // Fetch live members when component mounts
    useEffect(() => {
      if (outpost?.uuid) {
        dispatch(onGoingOutpostActions.getLiveMembers());
      }
    }, [dispatch, outpost?.uuid]);

    // Show loading state when getting live members
    if (isGettingLiveMembers || numberOfMembers === 0) {
      return (
        <div className="fixed top-18 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-[360px] w-[360px] max-h-[100vh] overflow-hidden z-50">
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
      <div className="fixed top-18 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-[360px] w-[360px] max-h-[100vh] overflow-hidden z-50">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">
            Live Members ({numberOfMembers})
          </h3>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          <MembersList />
        </div>
      </div>
    );
  },
  () => true
);
