"use client";
import { cn } from "app/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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

const useLoadingRouteEventBus = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialValue = loadingRouteEventBus.getValue();
    if (initialValue === id) {
      setLoading(true);
    }
    const subscription = loadingRouteEventBus.subscribe((message) => {
      if (message === id) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return loading;
};
