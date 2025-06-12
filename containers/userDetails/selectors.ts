import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const userDetailsDomains = {
  root: (state: RootState) => state.userDetails,
};

export const userDetailsSelectors = {};
