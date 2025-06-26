import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const createOutpostDomains = {
  image: (store: RootState) => store.createOutpost.selectedImage,
  isCreating: (store: RootState) => store.createOutpost.isCreating,
  error: (store: RootState) => store.createOutpost.error,
  name: (store: RootState) => store.createOutpost.name,
  subject: (store: RootState) => store.createOutpost.subject,
  tags: (store: RootState) => store.createOutpost.tags,
  allowedToEnter: (store: RootState) => store.createOutpost.allowedToEnter,
  allowedToSpeak: (store: RootState) => store.createOutpost.allowedToSpeak,
  scheduled: (store: RootState) => store.createOutpost.scheduled,
  scheduledFor: (store: RootState) => store.createOutpost.scheduledFor,
  adults: (store: RootState) => store.createOutpost.adults,
  recordable: (store: RootState) => store.createOutpost.recordable,
  reminderOffsetMinutes: (store: RootState) =>
    store.createOutpost.reminder_offset_minutes,
  passSellersRequiredToSpeak: (store: RootState) =>
    store.createOutpost.passSellersRequiredToSpeak,
  passSellersRequiredToEnter: (store: RootState) =>
    store.createOutpost.passSellersRequiredToEnter,
};
export const createOutpostSelectors = {
  image: createOutpostDomains.image,
  isCreating: createOutpostDomains.isCreating,
  error: createOutpostDomains.error,
  name: createOutpostDomains.name,
  subject: createOutpostDomains.subject,
  tags: createOutpostDomains.tags,
  allowedToEnter: createOutpostDomains.allowedToEnter,
  allowedToSpeak: createOutpostDomains.allowedToSpeak,
  scheduled: createOutpostDomains.scheduled,
  adults: createOutpostDomains.adults,
  recordable: createOutpostDomains.recordable,
  reminderOffsetMinutes: createOutpostDomains.reminderOffsetMinutes,
  fieldError: (field: "name" | "subject" | "tags") =>
    createSelector([createOutpostDomains.error], (error) => error?.[field]),
  passSellersRequiredToSpeak: createOutpostDomains.passSellersRequiredToSpeak,
  passSellersRequiredToEnter: createOutpostDomains.passSellersRequiredToEnter,
  allFields: createSelector(
    [
      createOutpostDomains.name,
      createOutpostDomains.subject,
      createOutpostDomains.tags,
      createOutpostDomains.allowedToEnter,
      createOutpostDomains.allowedToSpeak,
      createOutpostDomains.adults,
      createOutpostDomains.recordable,
      createOutpostDomains.scheduledFor,
      createOutpostDomains.image,
    ],
    (
      name,
      subject,
      tags,
      allowedToEnter,
      allowedToSpeak,
      adults,
      recordable,
      scheduledFor,
      image
    ) => ({
      name,
      subject,
      scheduled_for: scheduledFor,
      image,
      enter_type: allowedToEnter,
      speak_type: allowedToSpeak,
      has_adult_content: adults,
      is_recordable: recordable,
      tags,
    })
  ),
};
