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
import { ExternalWalletsState } from "app/containers/_externalWallets/slice";
import { UsersState } from "app/containers/_users/slice";
import { AllOutpostsState } from "app/containers/allOutposts/slice";
import { CreateOutpostState } from "app/containers/createOutpost/slice";
import { LeaderboardState } from "app/containers/dashboard/leaderboard/slice";
import { DashboardUsersState } from "app/containers/dashboard/users/slice";
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

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create an object to store injected reducers
const injectedReducers: Record<string, Reducer<any, AnyAction>> = {};

// Create an object to store injected sagas
const injectedSagas: Record<string, any> = {};

// Declare store variable
let store: Store<RootState, AnyAction>;

// Initial state of each injected slice, computed once per server process.
const serverInitialStates: Record<string, unknown> = {};

function serverInitialState(key: string) {
  if (!(key in serverInitialStates)) {
    serverInitialStates[key] = injectedReducers[key](undefined, {
      type: "@@nexus/SERVER_INIT",
    });
  }
  return serverInitialStates[key];
}

// Server renders must never share state between requests, and sagas only run
// in the browser, so the server gets a fresh, saga-less store. Slices injected
// during the render read as their initial state, matching the client's first
// render, so hydration stays consistent.
function makeServerStore(): Store<RootState, AnyAction> {
  const serverStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    devTools: false,
  }) as Store<RootState, AnyAction>;

  let base: RootState | undefined;
  let view: RootState | undefined;
  const getState = () => {
    const next = serverStore.getState();
    if (next !== base || !view) {
      base = next;
      view = new Proxy(next, {
        get: (target, key, receiver) =>
          typeof key === "string" && !(key in target) && key in injectedReducers
            ? serverInitialState(key)
            : Reflect.get(target, key, receiver),
      });
    }
    return view;
  };
  return { ...serverStore, getState };
}

// Function to get or create store - using function declaration for hoisting
export function getStore(): Store<RootState, AnyAction> {
  if (typeof window === "undefined") {
    return makeServerStore();
  }
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
  if (typeof window === "undefined") {
    injectedReducers[key] ??= reducer;
    return;
  }
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
    // siringe emoji instead of text
    console.log("💉 reducer", key);
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
      console.log("💉 saga", key);
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
  externalWallets: ExternalWalletsState;
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
  leaderboard: LeaderboardState;
};
export type AppDispatch = ReturnType<typeof getStore>["dispatch"];
