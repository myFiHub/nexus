"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `poll` every `intervalMs` while the tab is visible, and once right away
 * when it becomes visible again after the interval has elapsed.
 */
export function useVisiblePolling(
  poll: () => void,
  intervalMs: number,
  enabled = true
) {
  const pollRef = useRef(poll);
  useEffect(() => {
    pollRef.current = poll;
  });

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let lastRun = Date.now();

    const run = () => {
      lastRun = Date.now();
      pollRef.current();
    };
    const start = () => {
      if (timer) return;
      if (Date.now() - lastRun >= intervalMs) run();
      timer = setInterval(run, intervalMs);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () =>
      document.visibilityState === "visible" ? start() : stop();

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);
}
