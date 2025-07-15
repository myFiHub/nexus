"use client";

import { useAssetsSlice } from "app/containers/_assets/slice";
import { useDashboardUsersSlice } from "./slice";

export const DashboardUsersInjector = () => {
  useDashboardUsersSlice();
  useAssetsSlice();
  return null;
};
