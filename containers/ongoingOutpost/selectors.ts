import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const onGoingOutpostDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.onGoingOutpost.outpost,
  isGettingOutpost: (state: RootState) => state.onGoingOutpost.isGettingOutpost,
  isGettingLiveMembers: (state: RootState) =>
    state.onGoingOutpost.isGettingLiveMembers,
  accesses: (state: RootState) => state.onGoingOutpost?.accesses,
  members: (state: RootState) => state.onGoingOutpost?.liveMembers || {},
};

export const onGoingOutpostSelectors = {
  outpost: onGoingOutpostDomains.outpost,
  isGettingOutpost: onGoingOutpostDomains.isGettingOutpost,
  isGettingLiveMembers: onGoingOutpostDomains.isGettingLiveMembers,
  accesses: onGoingOutpostDomains.accesses,
  members: onGoingOutpostDomains.members,
  membersList: createSelector([onGoingOutpostDomains.members], (members) => {
    const list = Object.values(members);
    //sort by last_speaked_at_timestamp desc
    const sortedList = list.sort((a, b) => {
      const aTime = new Date(a.last_speaked_at_timestamp ?? 0).getTime();
      const bTime = new Date(b.last_speaked_at_timestamp ?? 0).getTime();
      return bTime - aTime;
    });
    return sortedList;
  }),
  membersCount: createSelector(
    [onGoingOutpostDomains.members],
    (members) => Object.keys(members).length
  ),
  member: (id: string) =>
    createSelector([onGoingOutpostDomains.members], (liveMembers) => {
      console.log({ liveMembers });
      return liveMembers[id];
    }),
  isTalking: (id: string) =>
    createSelector(
      [onGoingOutpostDomains.members],
      (liveMembers) => liveMembers[id]?.is_speaking ?? false
    ),
  remainingTime: (id: string) =>
    createSelector([onGoingOutpostDomains.members], (liveMembers) => {
      const member = liveMembers[id];
      if (!member) return 0;
      // remaining time is in seconds, so formatted remaining time in hours, minutes and seconds
      const hours = Math.floor(member.remaining_time / 3600);
      const minutes = Math.floor((member.remaining_time % 3600) / 60);
      const seconds = member.remaining_time % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }),
};
