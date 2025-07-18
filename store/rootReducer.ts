import { Reducer, combineReducers } from "@reduxjs/toolkit";
import { leaderboardReducer } from "app/containers/dashboard/leaderboard/slice";
import { dummyReducer } from "app/containers/zz_dummy/slice";

// Import your feature reducers here
// Example: import authReducer from './features/auth/authSlice';

export const rootReducer: Reducer = combineReducers({
  dummy: dummyReducer,
  leaderboard: leaderboardReducer,
});
