import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveMember, OutpostModel } from "app/services/api/types";
import { IncomingReactionType } from "app/services/wsClient/messageRouter";
import { injectContainer } from "app/store";
import { OutpostAccesses } from "../global/effects/types";
import { onGoingOutpostSaga } from "./saga";

export interface OnGoingOutpostState {
  outpost?: OutpostModel;
  accesses?: OutpostAccesses;
  isGettingOutpost: boolean;
  isGettingLiveMembers: boolean;
  liveMembers: {
    [address: string]: LiveMember;
  };
}

export const initialState: OnGoingOutpostState = {
  isGettingOutpost: false,
  isGettingLiveMembers: false,
  accesses: { canEnter: false, canSpeak: false },
  liveMembers: {},
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
