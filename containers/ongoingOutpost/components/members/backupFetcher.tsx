import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { OutpostModel } from "app/services/api/types";
import { onGoingOutpostActions } from "../../slice";

export const BackupFetcher = ({ outpost }: { outpost: OutpostModel }) => {
  const dispatch = useDispatch();
  const numberOfMembers = useSelector(onGoingOutpostSelectors.membersCount);
  const joined = useSelector(onGoingOutpostSelectors.joined);
  const numberOfMembersRef = useRef(numberOfMembers);
  const joinedRef = useRef(joined);
  useEffect(() => {
    numberOfMembersRef.current = numberOfMembers;
    joinedRef.current = joined;
  }, [numberOfMembers, joined]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (outpost?.uuid) {
      timeoutId = setTimeout(async () => {
        if (numberOfMembersRef.current === 0 && !joinedRef.current) {
          dispatch(onGoingOutpostActions.getLiveMembers());
        }
      }, 30000);
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [outpost?.uuid, joinedRef]);
  return <></>;
};
