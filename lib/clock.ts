"use client";
import { useMemo, useSyncExternalStore } from "react";

type Listener = () => void;

interface Clock {
  interval: number;
  now: number;
  listeners: Set<Listener>;
  timer?: ReturnType<typeof setTimeout>;
}

const clocks = new Map<number, Clock>();
let visibilityListenerAttached = false;

const isHidden = () =>
  typeof document !== "undefined" && document.visibilityState === "hidden";

function getClock(interval: number): Clock {
  let clock = clocks.get(interval);
  if (!clock) {
    clock = { interval, now: Date.now(), listeners: new Set() };
    clocks.set(interval, clock);
  }
  return clock;
}

function emit(clock: Clock) {
  clock.now = Date.now();
  clock.listeners.forEach((listener) => listener());
}

// Ticks land on interval boundaries so every clock of the same interval
// (and every countdown on screen) changes in the same frame.
function schedule(clock: Clock) {
  const delay = clock.interval - (Date.now() % clock.interval);
  clock.timer = setTimeout(() => {
    emit(clock);
    schedule(clock);
  }, delay);
}

function stop(clock: Clock) {
  if (clock.timer !== undefined) {
    clearTimeout(clock.timer);
    clock.timer = undefined;
  }
}

function attachVisibilityListener() {
  if (visibilityListenerAttached || typeof document === "undefined") return;
  visibilityListenerAttached = true;
  document.addEventListener("visibilitychange", () => {
    clocks.forEach((clock) => {
      if (clock.listeners.size === 0) return;
      if (isHidden()) {
        stop(clock);
      } else if (clock.timer === undefined) {
        emit(clock);
        schedule(clock);
      }
    });
  });
}

function subscribeTo(interval: number) {
  return (listener: Listener) => {
    const clock = getClock(interval);
    attachVisibilityListener();
    clock.listeners.add(listener);
    if (clock.timer === undefined && !isHidden()) {
      schedule(clock);
    }
    return () => {
      clock.listeners.delete(listener);
      if (clock.listeners.size === 0) stop(clock);
    };
  };
}

function readNow(interval: number): number {
  const clock = getClock(interval);
  // An idle clock has no timer refreshing it, so bring it up to date before
  // the first subscriber reads it.
  if (clock.timer === undefined && Date.now() - clock.now >= interval) {
    clock.now = Date.now();
  }
  return clock.now;
}

/**
 * Subscribes to a shared clock and returns `select(now)`.
 *
 * `now` is `null` during server rendering and hydration, so markup stays
 * identical on both sides. When `select` returns a primitive, the component
 * only re-renders when that value changes, not on every tick.
 */
export function useClock<T>(
  select: (now: number | null) => T,
  intervalMs: number = 1000
): T {
  const subscribe = useMemo(() => subscribeTo(intervalMs), [intervalMs]);
  return useSyncExternalStore(
    subscribe,
    () => select(readNow(intervalMs)),
    () => select(null)
  );
}

const identity = (now: number | null) => now;

/** Current time in ms, refreshed every `intervalMs`; `null` until hydrated. */
export function useNow(intervalMs: number = 1000): number | null {
  return useClock(identity, intervalMs);
}
