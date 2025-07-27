"use client";
import { useEffect } from "react";
import { BehaviorSubject } from "rxjs";

export const loadingRouteEventBus = new BehaviorSubject<string | undefined>(
  undefined
);

export const setRoutingEventBusId = (id?: string) => {
  loadingRouteEventBus.next(id);
};

export const clearRoutingEventBusId = () => {
  loadingRouteEventBus.next(undefined);
};

export const RouteLoaderCleaner = () => {
  useEffect(() => {
    return () => {
      clearRoutingEventBusId();
    };
  }, []);

  return <></>;
};
