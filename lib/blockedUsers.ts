"use client";

import podiumApi from "app/services/api";
import { BlockedUser } from "app/services/api/types";
import { useEffect, useSyncExternalStore } from "react";

interface BlockedState {
  ownerUuid: string | null;
  loaded: boolean;
  users: BlockedUser[];
}

const EMPTY: BlockedState = { ownerUuid: null, loaded: false, users: [] };

let state = EMPTY;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

const setState = (next: BlockedState) => {
  state = next;
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const load = (ownerUuid: string) => {
  if (state.ownerUuid === ownerUuid && (state.loaded || loading)) return loading ?? Promise.resolve();
  setState({ ownerUuid, loaded: false, users: [] });
  const request = podiumApi.getBlockedUsers().then((users) => {
    if (state.ownerUuid === ownerUuid) setState({ ownerUuid, loaded: true, users });
  });
  loading = request.finally(() => {
    loading = null;
  });
  return loading;
};

/** Blocked people for the signed-in user, loaded once per session. */
export const useBlockedUsers = (ownerUuid: string | undefined) => {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => EMPTY);
  useEffect(() => {
    if (ownerUuid) load(ownerUuid);
  }, [ownerUuid]);
  const mine = snapshot.ownerUuid === ownerUuid ? snapshot : EMPTY;
  return { loaded: mine.loaded, users: mine.users };
};

export const isBlocked = (users: BlockedUser[], uuid: string) => users.some((u) => u.uuid === uuid);

/** Optimistic; rolls back and resolves false when the server refuses. */
export const setBlocked = async (
  target: Omit<BlockedUser, "blocked_at">,
  block: boolean
): Promise<boolean> => {
  const owner = state.ownerUuid;
  const previousEntry = state.users.find((u) => u.uuid === target.uuid);
  const without = (users: BlockedUser[]) => users.filter((u) => u.uuid !== target.uuid);
  setState({
    ...state,
    users: block
      ? [{ ...target, blocked_at: Date.now() }, ...without(state.users)]
      : without(state.users),
  });
  const ok = await podiumApi.blockUser(target.uuid, block ? "block" : "unblock");
  if (!ok && state.ownerUuid === owner) {
    const rest = without(state.users);
    setState({ ...state, users: previousEntry ? [previousEntry, ...rest] : rest });
  }
  return ok;
};
