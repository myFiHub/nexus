"use client";

import { useDashboardUsersSlice } from "./slice";

export const DashboardUsersInjector = () => {
  useDashboardUsersSlice();
  return null;
};
