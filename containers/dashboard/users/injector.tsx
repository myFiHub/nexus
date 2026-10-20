"use client";

import { injectAssetsSlice } from "app/containers/_assets/slice";
import { injectDashboardUsersSlice } from "./slice";

export const DashboardUsersInjector = () => {
  injectDashboardUsersSlice();
  injectAssetsSlice();
  return null;
};
