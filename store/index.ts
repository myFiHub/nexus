import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
  Store,
  UnknownAction,
} from "@reduxjs/toolkit";
import { type AssetsState } from "app/containers/_assets/slice";
import { type GlobalState } from "app/containers/global/slice";
import { type ProfileState } from "app/containers/profile/slice";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";
import { UserDetailsState } from "app/containers/userDetails/slice";

let store: Store<Record<string, any>, AnyAction>;
// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create an object to store injected reducers
const injectedReducers: Record<
  string,
  Reducer<Record<string, any>, AnyAction>
> = {};

// Create an object to store injected sagas
const injectedSagas: Record<string, any> = {};

// Function to get or create store
export const getStore = (): any => {
  if (!store) {
    // Configure the store
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(sagaMiddleware),
      devTools: process.env.NODE_ENV !== "production",
    });

    // Run the root saga
    sagaMiddleware.run(rootSaga);
  }
  return store;
};

// Function to inject a reducer
const injectReducer = (
  key: string,
  reducer: Reducer<Record<string, any>, UnknownAction>
) => {
  if (injectedReducers[key]) {
    return;
  }

  injectedReducers[key] = reducer;
  const combinedReducer = combineReducers<Record<string, any>>({
    ...rootReducer,
    ...injectedReducers,
  }) as Reducer<Record<string, any>, UnknownAction>;

  getStore().replaceReducer(combinedReducer);
};

// Function to inject a saga
const injectSaga = (key: string, saga: any) => {
  if (injectedSagas[key]) {
    return;
  }
  injectedSagas[key] = saga;
  sagaMiddleware.run(saga);
};

export const injectContainer = (container: {
  name: string;
  reducer: any;
  saga: any;
}) => {
  injectReducer(container.name, container.reducer);
  injectSaga(container.name, container.saga);
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  global: GlobalState;
  profile: ProfileState;
  assets: AssetsState;
  userDetails: UserDetailsState;
};
export type AppDispatch = typeof store.dispatch;
