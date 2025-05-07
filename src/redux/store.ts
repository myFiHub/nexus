// Redux store setup for Podium Platform
// Uses Redux Toolkit for scalability and maintainability

import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import outpostReducer from './slices/outpostSlice';
import creatorReducer from './slices/creatorSlice';
import userReducer from './slices/userSlice';

// Root reducer with all slices
const store = configureStore({
  reducer: {
    wallet: walletReducer,
    outposts: outpostReducer,
    creators: creatorReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 