import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "app/lib/toast";
import { LiveMember, OutpostModel } from "app/services/api/types";
import { IncomingReactionType } from "app/services/wsClient/client";
import { injectContainer } from "app/store";
import { OutpostAccesses } from "../global/effects/types";
import { onGoingOutpostSaga } from "./saga";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
  accesses?: OutpostAccesses;
  isRecording: boolean;
  isGettingOutpost: boolean;
  isGettingLiveMembers: boolean;
  isCheeringAddress?: string;
  isBooingAddress?: string;
  isRefreshingLiveMembers: boolean;
  isInteractionsMuted: boolean;
  amIMuted: boolean;
  leaving: boolean;
  meetApiObj?: any;
  hasAudioPermission: boolean;
  talkingUsersAddress: string[];
  raisedHandUsers: {
    [address: string]: LiveMember;
  };
  joined: boolean;
  liveMembers: {
    [address: string]: LiveMember;
  };
}

export const initialState: OnGoingOutpostState = {
  isRecording: false,
  isGettingOutpost: false,
  isGettingLiveMembers: false,
  isRefreshingLiveMembers: false,
  isInteractionsMuted:
    typeof localStorage !== "undefined"
      ? localStorage.getItem("isInteractionsMuted") === "true"
      : false,
  accesses: { canEnter: false, canSpeak: false },
  liveMembers: {},
  hasAudioPermission: true,
  amIMuted: true,
  joined: false,
  raisedHandUsers: {},
  leaving: false,
  talkingUsersAddress: [],
};

const onGoingOutpostSlice = createSlice({
  name: "onGoingOutpost",
  initialState,
  reducers: {
    getOutpost(_, __: PayloadAction<{ id: string }>) {},
    setHasAudioPermission(state, action: PayloadAction<boolean>) {
      state.hasAudioPermission = action.payload;
    },
    isGettingOutpost(state, action: PayloadAction<boolean>) {
      state.isGettingOutpost = action.payload;
    },
    setOutpost(state, action: PayloadAction<OutpostModel | undefined>) {
      state.outpost = action.payload;
    },
    setAccesses(state, actions: PayloadAction<OutpostAccesses>) {
      state.accesses = actions.payload;
    },
    leaveOutpost(state, action: PayloadAction<OutpostModel>) {},
    like(state, action: PayloadAction<{ targetUserAddress: string }>) {},
    cheerBoo(
      state,
      action: PayloadAction<{
        user: LiveMember;
        cheer: boolean;
      }>
    ) {},
    setIsCheeringAddress(state, action: PayloadAction<{ address?: string }>) {
      state.isCheeringAddress = action.payload.address;
    },
    setIsBooingAddress(state, action: PayloadAction<{ address?: string }>) {
      state.isBooingAddress = action.payload.address;
    },

    dislike(state, action: PayloadAction<{ targetUserAddress: string }>) {},
    startSpeaking() {},
    stopSpeaking() {},
    startRecording() {},
    getLiveMembers(
      state,
      __: PayloadAction<{ silent: boolean; forceJoin?: boolean } | undefined>
    ) {
      state.isRefreshingLiveMembers = true;
    },
    statrtStopRecording(state, action: PayloadAction<boolean>) {},
    setIsRecording(state, action: PayloadAction<boolean>) {
      state.isRecording = action.payload;
      if (action.payload) {
        toast.warning("Creator started recording the outpost");
      } else {
        toast.success("Creator stopped recording the outpost");
      }
    },

    isGettingLiveMembers(state, action: PayloadAction<boolean>) {
      state.isGettingLiveMembers = action.payload;
    },
    setLiveMembers(
      state,
      action: PayloadAction<{
        [address: string]: LiveMember;
      }>
    ) {
      state.liveMembers = action.payload;
    },
    updateRemainingTime(
      state,
      action: PayloadAction<{ userAddress: string; remainingTime: number }>
    ) {
      const { userAddress, remainingTime } = action.payload;
      if (state.liveMembers[userAddress]) {
        const member = state.liveMembers[userAddress];
        state.liveMembers = {
          ...state.liveMembers,
          [userAddress]: {
            ...member,
            remaining_time: remainingTime,
          },
        };
      }
    },
    updateUserIsTalking(
      state,
      action: PayloadAction<{ userAddress: string; isTalking: boolean }>
    ) {
      const now = Date.now();
      const members = { ...state.liveMembers };
      members[action.payload.userAddress] = {
        ...members[action.payload.userAddress],
        is_speaking: action.payload.isTalking,
        last_speaked_at_timestamp: now,
      };
      if (action.payload.isTalking) {
        state.talkingUsersAddress.push(action.payload.userAddress);
      } else {
        state.talkingUsersAddress = state.talkingUsersAddress.filter(
          (address) => address !== action.payload.userAddress
        );
      }
      state.liveMembers = members;
    },

    incomingUserReaction(
      state,
      action: PayloadAction<{
        userAddress: string;
        reaction: IncomingReactionType;
      }>
    ) {},
    handleTimeIsUp(state, action: PayloadAction<{ userAddress: string }>) {
      state.liveMembers[action.payload.userAddress] = {
        ...state.liveMembers[action.payload.userAddress],
        is_speaking: false,
      };
    },
    setAmIMuted(state, action: PayloadAction<boolean>) {
      state.amIMuted = action.payload;
    },
    setMeetApiObj(state, action: PayloadAction<any>) {
      state.meetApiObj = action.payload;
    },
    waitForCreator(_, __) {},
    setJoined(state, action: PayloadAction<boolean>) {
      state.joined = action.payload;
    },
    setCreatorJoined(state, action: PayloadAction<boolean>) {
      if (state.outpost && !state.outpost.creator_joined) {
        toast.success(`Creator of ${state.outpost.name} joined the outpost`);
        state.outpost.creator_joined = action.payload;
      }
    },
    addToRaisedHand(
      state,
      action: PayloadAction<{ address: string; user: LiveMember }>
    ) {
      state.raisedHandUsers[action.payload.address] = action.payload.user;
    },
    removeFromRaisedHand(state, action: PayloadAction<string>) {
      const { [action.payload]: _, ...rest } = state.raisedHandUsers;
      state.raisedHandUsers = rest;
    },
    setLeaving(state, action: PayloadAction<boolean>) {
      state.leaving = action.payload;
    },
    setIsRefreshingLiveMembers(state, action: PayloadAction<boolean>) {
      state.isRefreshingLiveMembers = action.payload;
    },
    setIsInteractionsMuted(state, action: PayloadAction<boolean>) {
      state.isInteractionsMuted = action.payload;
      localStorage.setItem("isInteractionsMuted", action.payload.toString());
    },
  },
});

export const {
  reducer: onGoingOutpostReducer,
  name,
  actions: onGoingOutpostActions,
} = onGoingOutpostSlice;

export const useOnGoingOutpostSlice = () => {
  injectContainer({
    name: onGoingOutpostSlice.name,
    reducer: onGoingOutpostSlice.reducer,
    saga: onGoingOutpostSaga,
  });
};
