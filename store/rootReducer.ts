import { Reducer, combineReducers } from "@reduxjs/toolkit";
import { assetsReducer } from "app/containers/_assets/slice";
import { usersReducer } from "app/containers/_users/slice";
import { globalReducer } from "app/containers/global/slice";
import { myOutpostsReducer } from "app/containers/myOutposts/slice";
import { onGoingOutpostReducer } from "app/containers/ongoingOutpost/slice";
import { outpostDetailsReducer } from "app/containers/outpostDetails/slice";
import { profileReducer } from "app/containers/profile/slice";
import { userDetailsReducer } from "app/containers/userDetails/slice";

// Import your feature reducers here
// Example: import authReducer from './features/auth/authSlice';

const initialState: Record<string, any> = {};

export const rootReducer: Reducer = combineReducers({
  global: globalReducer,
  profile: profileReducer,
  assets: assetsReducer,
  users: usersReducer,
  outpostDetails: outpostDetailsReducer,
  onGoingOutpost: onGoingOutpostReducer,
  myOutposts: myOutpostsReducer,
  userDetails: userDetailsReducer,
});
