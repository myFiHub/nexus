"use client";
import { useUserDetailsSlice } from "../../slice";
import { useUsersSlice } from "app/containers/_users/slice";
export const UserDetailsSliceInjector = () => {
  useUserDetailsSlice();
  useUsersSlice();
  return <></>;
};
