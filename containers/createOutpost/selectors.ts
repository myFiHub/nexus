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
  adults: (store: RootState) => store.createOutpost.adults,
  recordable: (store: RootState) => store.createOutpost.recordable,
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
};
