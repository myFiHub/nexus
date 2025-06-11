import { AnyAction, Reducer } from "@reduxjs/toolkit";

// Import your feature reducers here
// Example: import authReducer from './features/auth/authSlice';

const initialState: Record<string, any> = {};

export const rootReducer: Reducer<Record<string, any>, AnyAction> = (
  state = initialState,
  action
) => {
  return state;
};
