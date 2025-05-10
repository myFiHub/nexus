// Redux store setup for Podium Platform
// Uses Redux Toolkit for scalability and maintainability

import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';
import outpostReducer from './slices/outpostSlice';
import creatorReducer from './slices/creatorSlice';
import userReducer from './slices/userSlice';
import sessionReducer from './slices/sessionSlice';

// Root reducer with all slices
const store = configureStore({
  reducer: {
    wallet: walletReducer,
    outposts: outpostReducer,
    creators: creatorReducer,
    user: userReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['wallet/setWallet'],
        ignoredPaths: ['wallet.provider'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 