"use client";
import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
  Store,
  UnknownAction,
} from "@reduxjs/toolkit";
import { type AssetsState } from "app/containers/_assets/slice";
import { UsersState } from "app/containers/_users/slice";
import { AllOutpostsState } from "app/containers/allOutposts/slice";
import { CreateOutpostState } from "app/containers/createOutpost/slice";
import { type GlobalState } from "app/containers/global/slice";
import { MyOutpostsState } from "app/containers/myOutposts/slice";
import { NotificationsState } from "app/containers/notifications/slice";
import { OnGoingOutpostState } from "app/containers/ongoingOutpost/slice";
import { OutpostDetailsState } from "app/containers/outpostDetails/slice";
import { type ProfileState } from "app/containers/profile/slice";
import { UserDetailsState } from "app/containers/userDetails/slice";
import { isDev } from "app/lib/utils";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";
import { DashboardUsersState } from "app/containers/dashboard/users/slice";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create an object to store injected reducers
const injectedReducers: Record<string, Reducer<any, AnyAction>> = {};

// Create an object to store injected sagas
const injectedSagas: Record<string, any> = {};

// Declare store variable
let store: Store<RootState, AnyAction>;

// Function to get or create store - using function declaration for hoisting
export function getStore(): Store<RootState, AnyAction> {
  if (!store) {
    // Configure the store
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(sagaMiddleware),
      devTools: isDev,
    });

    // Run the root saga
    sagaMiddleware.run(rootSaga);
  }
  return store;
}

// Function to inject a reducer
function injectReducer(key: string, reducer: Reducer<any, UnknownAction>) {
  if (typeof window !== "undefined") {
    if (injectedReducers[key]) {
      return;
    }

    injectedReducers[key] = reducer;
    const combinedReducer = combineReducers<RootState>(
      // @ts-ignore
      {
        ...rootReducer,
        ...injectedReducers,
      }
    ) as Reducer<RootState, UnknownAction>;

    getStore().replaceReducer(combinedReducer);
    if (isDev) {
      console.log("injected reducer", key);
    }
  }
}

// Function to inject a saga
function injectSaga(key: string, saga: any) {
  if (typeof window !== "undefined") {
    if (injectedSagas[key]) {
      return;
    }
    injectedSagas[key] = saga;
    sagaMiddleware.run(saga);
    if (isDev) {
      console.log("injected saga", key);
    }
  }
}

export function injectContainer(container: {
  name: string;
  reducer: any;
  saga: any;
}) {
  injectReducer(container.name, container.reducer);
  injectSaga(container.name, container.saga);
}

export function isRegisteredSlice({ name }: { name: string }) {
  return !!injectedReducers[name] && !!injectedSagas[name];
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  global: GlobalState;
  profile: ProfileState;
  assets: AssetsState;
  userDetails: UserDetailsState;
  users: UsersState;
  outpostDetails: OutpostDetailsState;
  onGoingOutpost: OnGoingOutpostState;
  myOutposts: MyOutpostsState;
  createOutpost: CreateOutpostState;
  notifications: NotificationsState;
  allOutposts: AllOutpostsState;
  dashboardUsers: DashboardUsersState;
};
export type AppDispatch = ReturnType<typeof getStore>["dispatch"];
