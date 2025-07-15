"use client";

import { useLeaderboardSlice } from "./slice";

export const LeaderboardInjector = () => {
  useLeaderboardSlice();
  return null;
};
