import { RootState } from "app/store";

export const outpostDetailsDomains = {
  root: (state: RootState) => state,
  outpost: (state: RootState) => state.outpostDetails?.outpost,
  editingScheduledDate: (state: RootState) =>
    state.outpostDetails?.editingScheduledDate ?? false,
};

export const outpostDetailsSelectors = {
  outpost: outpostDetailsDomains.outpost,
  editingScheduledDate: outpostDetailsDomains.editingScheduledDate,
};
