"use client";
import { cn } from "app/lib/utils";
import { Loader2 } from "lucide-react";
import { useSyncExternalStore } from "react";
import { loadingRouteEventBus } from "../eventBus";

export const RoutingLoadingComponent = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const loading = useLoadingRouteEventBus({ id });

  if (!loading) {
    return <></>;
  }

  return <Loader2 className={cn(" animate-spin text-purple-400", className)} />;
};

const subscribeToRouteLoading = (onChange: () => void) => {
  const subscription = loadingRouteEventBus.subscribe(onChange);
  return () => subscription.unsubscribe();
};

const subscribe = (onChange: () => void) => {
  const subscription = loadingRouteEventBus.subscribe(onChange);
  return () => subscription.unsubscribe();
};

const useLoadingRouteEventBus = ({ id }: { id: string }) =>
  useSyncExternalStore(
    subscribe,
    () => loadingRouteEventBus.getValue() === id,
    () => false
  );
