"use client";

import { toast } from "app/lib/toast";
import { ApiResult } from "app/services/api";
import { AnalyticsWindow } from "app/services/api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_ANALYTICS_WINDOW, localUtcOffsetMinutes } from "./format";

interface WindowResult<T> {
  data?: T;
  error?: string;
  status?: number;
}

export type AnalyticsLoader<T> = (
  window: AnalyticsWindow,
  utcOffsetMinutes: number
) => Promise<ApiResult<T>>;

/**
 * Loads one result per window and keeps it, so switching back is instant.
 * Remount (via key) to reset when the subject changes.
 */
export const useWindowedAnalytics = <T>(load: AnalyticsLoader<T>, enabled: boolean) => {
  const [window, setWindow] = useState<AnalyticsWindow>(DEFAULT_ANALYTICS_WINDOW);
  const [results, setResults] = useState<Partial<Record<AnalyticsWindow, WindowResult<T>>>>({});
  const [refreshing, setRefreshing] = useState(false);
  const inFlight = useRef(new Set<AnalyticsWindow>());
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const fetchWindow = useCallback((target: AnalyticsWindow) => {
    inFlight.current.add(target);
    return loadRef
      .current(target, localUtcOffsetMinutes())
      .then(
        (result): WindowResult<T> => ({
          data: result.data,
          error: result.data ? undefined : (result.error ?? "Something went wrong"),
          status: result.status,
        })
      )
      .catch((): WindowResult<T> => ({ error: "Something went wrong" }))
      .finally(() => inFlight.current.delete(target));
  }, []);

  const current = results[window];

  useEffect(() => {
    if (!enabled || current || inFlight.current.has(window)) return;
    fetchWindow(window).then((result) =>
      setResults((prev) => ({ ...prev, [window]: result }))
    );
  }, [enabled, current, window, fetchWindow]);

  const refresh = useCallback(() => {
    if (!enabled || inFlight.current.has(window)) return;
    const target = window;
    const hasData = !!current?.data;
    setRefreshing(true);
    fetchWindow(target).then((result) => {
      setRefreshing(false);
      if (result.error && hasData) {
        toast.error(result.error);
        return;
      }
      setResults((prev) => ({ ...prev, [target]: result }));
    });
  }, [enabled, window, current, fetchWindow]);

  return {
    window,
    setWindow,
    data: current?.data,
    error: current?.error,
    status: current?.status,
    loading: enabled && !current,
    refreshing,
    refresh,
  };
};
