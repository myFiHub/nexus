"use client";
import { injectUserDetailsSlice } from "../../slice";
import { injectUsersSlice } from "app/containers/_users/slice";
export const UserDetailsSliceInjector = () => {
  injectUserDetailsSlice();
  injectUsersSlice();
  return <></>;
};
