import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const createOutpostDomains = {
  image: (store: RootState) => store.createOutpost.selectedImage,
  isCreating: (store: RootState) => store.createOutpost.isCreating,
  error: (store: RootState) => store.createOutpost.error,
  name: (store: RootState) => store.createOutpost.name,
  subject: (store: RootState) => store.createOutpost.subject,
  tags: (store: RootState) => store.createOutpost.tags,
  allowedToEnterType: (store: RootState) => store.createOutpost.allowedToEnter,
  allowedToSpeakType: (store: RootState) => store.createOutpost.allowedToSpeak,
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
  enabledLuma: (store: RootState) => store.createOutpost.enabledLuma,
  lumaGuests: (store: RootState) => store.createOutpost.lumaGuests,
  lumaHosts: (store: RootState) => store.createOutpost.lumaHosts,
  cohostUsers: (store: RootState) => store.createOutpost?.cohostUsers || [],
};
export const createOutpostSelectors = {
  image: createOutpostDomains.image,
  isCreating: createOutpostDomains.isCreating,
  error: createOutpostDomains.error,
  name: createOutpostDomains.name,
  subject: createOutpostDomains.subject,
  tags: createOutpostDomains.tags,
  allowedToEnterType: createOutpostDomains.allowedToEnterType,
  allowedToSpeakType: createOutpostDomains.allowedToSpeakType,
  scheduled: createOutpostDomains.scheduled,
  scheduledFor: createOutpostDomains.scheduledFor,
  adults: createOutpostDomains.adults,
  recordable: createOutpostDomains.recordable,
  reminderOffsetMinutes: createOutpostDomains.reminderOffsetMinutes,
  fieldError: (field: "name" | "subject" | "tags") =>
    createSelector([createOutpostDomains.error], (error) => error?.[field]),
  passSellersRequiredToSpeak: createOutpostDomains.passSellersRequiredToSpeak,
  passSellersRequiredToEnter: createOutpostDomains.passSellersRequiredToEnter,
  enabledLuma: createOutpostDomains.enabledLuma,
  lumaGuests: createOutpostDomains.lumaGuests,
  lumaHosts: createOutpostDomains.lumaHosts,
  cohostUsers: createOutpostDomains.cohostUsers,
  allFields: createSelector(
    [
      createOutpostDomains.name,
      createOutpostDomains.subject,
      createOutpostDomains.tags,
      createOutpostDomains.allowedToEnterType,
      createOutpostDomains.allowedToSpeakType,
      createOutpostDomains.adults,
      createOutpostDomains.recordable,
      createOutpostDomains.scheduledFor,
      createOutpostDomains.image,
      createOutpostDomains.passSellersRequiredToSpeak,
      createOutpostDomains.passSellersRequiredToEnter,
      createOutpostDomains.enabledLuma,
      createOutpostDomains.lumaGuests,
      createOutpostDomains.lumaHosts,
      createOutpostDomains.cohostUsers,
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
      image,
      passSellersRequiredToSpeak,
      passSellersRequiredToEnter,
      enabledLuma,
      lumaGuests,
      lumaHosts,
      cohostUsers
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
      enabled_luma: enabledLuma,
      luma_guests: lumaGuests,
      luma_hosts: lumaHosts,
      tickets_to_speak: Object.values(passSellersRequiredToSpeak || {}).map(
        (user) => user.address
      ),
      tickets_to_enter: Object.values(passSellersRequiredToEnter || {}).map(
        (user) => user.address
      ),
      cohost_user_uuids: cohostUsers?.map((user) => user.uuid),
    })
  ),
};
