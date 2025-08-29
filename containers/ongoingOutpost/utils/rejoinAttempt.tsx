import { GlobalSelectors } from "app/containers/global/selectors";
import { isDev } from "app/lib/utils";
import { wsClient } from "app/services/wsClient";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../selectors";
import { onGoingOutpostActions } from "../slice";

export const RejoinAttempt = () => {
  const dispatch = useDispatch();
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const members = useSelector(onGoingOutpostSelectors.members);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const outpostId = useSelector(onGoingOutpostSelectors.outpost)?.uuid;

  useEffect(() => {
    timeOutRef.current = setTimeout(async () => {
      const myUserId = myUser?.uuid;
      const isMember = Object.values(members).some(
        (member) => member.uuid === myUserId
      );
      if (!isMember) {
        if (isDev)
          console.log("RejoinAttempt: Not a member, attempting to rejoin");
        const result = await wsClient.asyncJoin(outpostId ?? "");
        if (result) {
          console.log("RejoinAttempt: Success");
          dispatch(onGoingOutpostActions.getLiveMembers({ silent: true }));
        } else {
          console.log("RejoinAttempt: Failed");
        }
      } else {
        if (isDev) console.log("RejoinAttempt: Already a member, skipping");
      }
    }, 5000);
    return () => clearTimeout(timeOutRef.current ?? 0);
  }, [members]);
  return <></>;
};
