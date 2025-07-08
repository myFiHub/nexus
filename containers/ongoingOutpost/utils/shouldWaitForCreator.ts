import { OutpostModel } from "app/services/api/types";
import { getStore } from "app/store";

export const shouldWaitForCreator = ({
  outpost,
}: {
  outpost: OutpostModel;
}) => {
  const store = getStore();
  const myUser = store.getState().global.podiumUserInfo;
  const scheduledFor = outpost.scheduled_for;
  if (!scheduledFor) {
    return false;
  }
  const nowInMilliseconds = new Date().getTime();
  const alreadyStarted = scheduledFor && scheduledFor < nowInMilliseconds;
  const creatorJoined = outpost.creator_joined;
  const iAmCreator = outpost.creator_user_uuid === myUser?.uuid;
  if (iAmCreator) {
    return false;
  }
  if (!alreadyStarted && !creatorJoined) {
    return true;
  }
  if (alreadyStarted && creatorJoined) {
    return false;
  }
};
