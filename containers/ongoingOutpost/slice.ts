import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveMember, OutpostModel, User } from "app/services/api/types";
import { IncomingReactionType } from "app/services/wsClient/messageRouter";
import { injectContainer } from "app/store";
import { OutpostAccesses } from "../global/effects/types";
import { onGoingOutpostSaga } from "./saga";
import { confettiEventBus } from "./eventBusses/confetti";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
  accesses?: OutpostAccesses;
  isGettingOutpost: boolean;
  isGettingLiveMembers: boolean;
  isCheeringAddress?: string;
  isBooingAddress?: string;
  amIMuted: boolean;
  meetApiObj?: any;
  raisedHandUsers: {
    [address: string]: LiveMember;
  };
  joined: boolean;
  liveMembers: {
    [address: string]: LiveMember;
  };
}

export const initialState: OnGoingOutpostState = {
  isGettingOutpost: false,
  isGettingLiveMembers: false,
  accesses: { canEnter: false, canSpeak: false },
  liveMembers: {},
  amIMuted: true,
  joined: false,
  raisedHandUsers: {},
};

const onGoingOutpostSlice = createSlice({
  name: "onGoingOutpost",
  initialState,
  reducers: {
    getOutpost(_, __: PayloadAction<{ id: string }>) {},
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
    getLiveMembers() {},

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
      state.liveMembers[userAddress] = {
        ...state.liveMembers[userAddress],
        remaining_time: remainingTime,
      };
    },
    updateUserIsTalking(
      state,
      action: PayloadAction<{ userAddress: string; isTalking: boolean }>
    ) {
      state.liveMembers[action.payload.userAddress] = {
        ...state.liveMembers[action.payload.userAddress],
        is_speaking: action.payload.isTalking,
      };
    },
    updateUserIsRecording(
      state,
      action: PayloadAction<{ userAddress: string; isRecording: boolean }>
    ) {
      state.liveMembers[action.payload.userAddress] = {
        ...state.liveMembers[action.payload.userAddress],
        is_recording: action.payload.isRecording,
      };
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
    setJoined(state, action: PayloadAction<boolean>) {
      state.joined = action.payload;
    },
    addToRaisedHand(
      state,
      action: PayloadAction<{ address: string; user: LiveMember }>
    ) {
      state.raisedHandUsers[action.payload.address] = action.payload.user;
    },
    removeFromRaisedHand(state, action: PayloadAction<string>) {
      delete state.raisedHandUsers[action.payload];
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
    name: name,
    reducer: onGoingOutpostReducer,
    saga: onGoingOutpostSaga,
  });
};
