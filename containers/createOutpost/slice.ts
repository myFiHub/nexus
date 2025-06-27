import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FreeOutpostEnterTypes,
  FreeOutpostSpeakerTypes,
} from "app/components/outpost/types";
import { User } from "app/services/api/types";
import { injectContainer } from "app/store";
import { createOutpostSaga } from "./saga";
import { AddGuestModel, AddHostModel } from "app/services/api/luma";

export interface CreateOutpostState {
  name: string;
  subject: string;
  tags: string[];
  allowedToEnter: string;
  allowedToSpeak: string;
  scheduled: boolean;
  scheduledFor: number;
  adults: boolean;
  recordable: boolean;
  selectedImage?: File;
  isCreating: boolean;
  enabledLuma: boolean;
  reminder_offset_minutes?: number;
  lumaGuests: AddGuestModel[];
  lumaHosts: AddHostModel[];
  passSellersRequiredToSpeak: {
    [uuid: string]: User;
  };
  passSellersRequiredToEnter: {
    [uuid: string]: User;
  };
  error?: {
    name?: string;
    subject?: string;
    tags?: string;
  };
}

const initialState: CreateOutpostState = {
  name: "",
  subject: "",
  tags: [],
  allowedToEnter: FreeOutpostEnterTypes.public,
  allowedToSpeak: FreeOutpostSpeakerTypes.everyone,
  scheduled: false,
  scheduledFor: 0,
  adults: false,
  recordable: false,
  enabledLuma: false,
  passSellersRequiredToSpeak: {},
  passSellersRequiredToEnter: {},
  lumaGuests: [],
  lumaHosts: [],
  selectedImage: undefined,
  isCreating: false,
  error: undefined,
};

const createOutpostSlice = createSlice({
  name: "createOutpost",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      const name = action.payload;

      if (name.length > 50) {
        state.error = {
          ...state.error,
          name: "Name must be less than 50 characters",
        };
        return;
      } else {
        state.error = {
          ...state.error,
          name: undefined,
        };
      }

      state.name = name;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      const subject = action.payload;
      if (subject.length > 50) {
        state.error = {
          ...state.error,
          subject: "Subject must be less than 50 characters",
        };
      } else {
        state.error = {
          ...state.error,
          subject: undefined,
        };
        state.subject = subject;
      }
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
    setScheduledFor: (state, action: PayloadAction<number>) => {
      state.scheduledFor = action.payload;
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
    setError: (
      state,
      action: PayloadAction<{
        field: "name" | "subject" | "tags";
        message: string;
      }>
    ) => {
      const field = action.payload.field;
      if (state.error) {
        state.error[field] = action.payload.message;
      } else {
        state.error = {
          [field]: action.payload.message,
        };
      }
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setReminderOffsetMinutes: (state, action: PayloadAction<number>) => {
      state.reminder_offset_minutes = action.payload;
    },
    togglePassSellerRequiredToSpeak: (state, action: PayloadAction<User>) => {
      if (state.passSellersRequiredToSpeak[action.payload.uuid]) {
        delete state.passSellersRequiredToSpeak[action.payload.uuid];
      } else {
        state.passSellersRequiredToSpeak[action.payload.uuid] = action.payload;
      }
    },
    togglePassSellerRequiredToEnter: (state, action: PayloadAction<User>) => {
      if (state.passSellersRequiredToEnter[action.payload.uuid]) {
        delete state.passSellersRequiredToEnter[action.payload.uuid];
      } else {
        state.passSellersRequiredToEnter[action.payload.uuid] = action.payload;
      }
    },
    setPassSellersRequiredToSpeak: (
      state,
      action: PayloadAction<{ [uuid: string]: User }>
    ) => {
      state.passSellersRequiredToSpeak = action.payload;
    },
    setPassSellersRequiredToEnter: (
      state,
      action: PayloadAction<{ [uuid: string]: User }>
    ) => {
      state.passSellersRequiredToEnter = action.payload;
    },

    submit: () => {},

    reset: () => {
      return initialState;
    },
    setEnabledLuma: (state, action: PayloadAction<boolean>) => {
      state.enabledLuma = action.payload;
    },
    toggleLumaGuest: (state, action: PayloadAction<AddGuestModel>) => {
      const guest = action.payload;
      if (state.lumaGuests.map((g) => g.email).includes(guest.email)) {
        state.lumaGuests = state.lumaGuests.filter(
          (g) => g.email !== guest.email
        );
      } else {
        state.lumaGuests.push(guest);
      }
    },
    setLumaGuests(state, action: PayloadAction<AddGuestModel[]>) {
      state.lumaGuests = action.payload;
    },
    toggleLumaHost: (state, action: PayloadAction<AddHostModel>) => {
      const host = action.payload;
      if (state.lumaHosts.map((h) => h.email).includes(host.email)) {
        state.lumaHosts = state.lumaHosts.filter((h) => h.email !== host.email);
      } else {
        state.lumaHosts.push(host);
      }
    },
    setLumaHosts(state, action: PayloadAction<AddHostModel[]>) {
      state.lumaHosts = action.payload;
    },
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
