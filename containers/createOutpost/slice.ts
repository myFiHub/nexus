import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FreeOutpostAccessTypes,
  FreeOutpostSpeakerTypes,
} from "app/components/outpost/types";
import { injectContainer } from "app/store";
import { createOutpostSaga } from "./saga";

export interface CreateOutpostState {
  name: string;
  subject: string;
  tags: string[];
  allowedToEnter: string;
  allowedToSpeak: string;
  scheduled: boolean;
  adults: boolean;
  recordable: boolean;
  selectedImage?: File;
  isCreating: boolean;
  error?: string;
}

const initialState: CreateOutpostState = {
  name: "",
  subject: "",
  tags: [],
  allowedToEnter: FreeOutpostAccessTypes.public,
  allowedToSpeak: FreeOutpostSpeakerTypes.everyone,
  scheduled: false,
  adults: false,
  recordable: false,

  selectedImage: undefined,
  isCreating: false,
  error: undefined,
};

const createOutpostSlice = createSlice({
  name: "createOutpost",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setAllowedToEnter: (state, action: PayloadAction<string>) => {
      state.allowedToEnter = action.payload;
    },
    setAllowedToSpeak: (state, action: PayloadAction<string>) => {
      state.allowedToSpeak = action.payload;
    },
    setScheduled: (state, action: PayloadAction<boolean>) => {
      state.scheduled = action.payload;
    },
    setAdults: (state, action: PayloadAction<boolean>) => {
      state.adults = action.payload;
    },
    setRecordable: (state, action: PayloadAction<boolean>) => {
      state.recordable = action.payload;
    },
    setSelectedImage: (state, action: PayloadAction<File>) => {
      state.selectedImage = action.payload;
    },
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    submit: () => {},
  },
});

export const {
  reducer: createOutpostReducer,
  name,
  actions: createOutpostActions,
} = createOutpostSlice;

export const useCreateOutpostSlice = () => {
  injectContainer({
    name: name,
    reducer: createOutpostReducer,
    saga: createOutpostSaga,
  });
};
