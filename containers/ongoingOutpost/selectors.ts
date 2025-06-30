import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { GlobalDomains } from "../global/selectors";

export const onGoingOutpostDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.onGoingOutpost.outpost,
  isGettingOutpost: (state: RootState) => state.onGoingOutpost.isGettingOutpost,
  isGettingLiveMembers: (state: RootState) =>
    state.onGoingOutpost.isGettingLiveMembers,
  accesses: (state: RootState) => state.onGoingOutpost?.accesses,
  members: (state: RootState) => state.onGoingOutpost?.liveMembers || {},
  isCheeringAddress: (state: RootState) =>
    state.onGoingOutpost.isCheeringAddress,
  isBooingAddress: (state: RootState) => state.onGoingOutpost.isBooingAddress,
  amIMuted: (state: RootState) => state.onGoingOutpost.amIMuted,
  meetApiObj: (state: RootState) => state.onGoingOutpost.meetApiObj,
  joined: (state: RootState) => state.onGoingOutpost.joined,
  raisedHandUsers: (state: RootState) => state.onGoingOutpost.raisedHandUsers,
};

export const onGoingOutpostSelectors = {
  outpost: onGoingOutpostDomains.outpost,
  amIMuted: onGoingOutpostDomains.amIMuted,
  meetApiObj: onGoingOutpostDomains.meetApiObj,
  isGettingOutpost: onGoingOutpostDomains.isGettingOutpost,
  isGettingLiveMembers: onGoingOutpostDomains.isGettingLiveMembers,
  accesses: onGoingOutpostDomains.accesses,
  members: onGoingOutpostDomains.members,
  myUserInOutpostMembers: createSelector(
    [onGoingOutpostDomains.members, GlobalDomains.podiumUserInfo],
    (members, myUser) => {
      if (!myUser) {
        return undefined;
      }
      return members[myUser.address];
    }
  ),
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
      return liveMembers[id];
    }),
  isTalking: (id: string) =>
    createSelector(
      [onGoingOutpostDomains.members],
      (liveMembers) => liveMembers[id]?.is_speaking ?? false
    ),
  remainingTime: (id?: string) =>
    createSelector([onGoingOutpostDomains.members], (liveMembers) => {
      if (!id) {
        return 0;
      }
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
  remainingTimeInSeconds: (id?: string) =>
    createSelector([onGoingOutpostDomains.members], (liveMembers) => {
      if (!id) {
        return 0;
      }
      const member = liveMembers[id];
      if (!member) return 0;
      return member.remaining_time;
    }),
  isCheeringAddress: onGoingOutpostDomains.isCheeringAddress,
  isBooingAddress: onGoingOutpostDomains.isBooingAddress,
  joined: onGoingOutpostDomains.joined,
  raisedHandUsers: onGoingOutpostDomains.raisedHandUsers,
  isHandRaised: (address?: string) =>
    createSelector(
      [onGoingOutpostDomains.raisedHandUsers],
      (raisedHandUsers) => {
        if (!address) {
          return false;
        }
        return raisedHandUsers[address] !== undefined;
      }
    ),
};
