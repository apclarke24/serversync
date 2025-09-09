/**
 * React hook for using stores with useSyncExternalStore
 */

import { useSyncExternalStore } from "use-sync-external-store/shim";
import type { StoreAPI, StoreState } from "../types";

/**
 * Create a React hook for a store
 */
export function createStoreHook<T extends StoreState>(store: StoreAPI<T>) {
  function useStoreHook(): T;
  function useStoreHook<Selected>(selector: (state: T) => Selected): Selected;
  function useStoreHook<Selected>(
    selector?: (state: T) => Selected
  ): Selected | T {
    // Create a memoized selector to avoid unnecessary re-renders
    const selectorFn = selector || ((state: T) => state);

    // Use React's useSyncExternalStore for concurrent rendering safety
    const selectedState = useSyncExternalStore(
      store.subscribe,
      () => selectorFn(store.getSnapshot()),
      store.getServerSnapshot
        ? () => selectorFn(store.getServerSnapshot!())
        : undefined
    );

    return selectedState;
  }

  return useStoreHook;
}

/**
 * Generic store hook that works with any store
 */
export function useStore<T extends StoreState, Selected = T>(
  store: StoreAPI<T>,
  selector?: (state: T) => Selected
): Selected {
  const selectorFn = (selector || ((state: T) => state)) as (
    state: T
  ) => Selected;

  const selectedState = useSyncExternalStore(
    store.subscribe,
    () => selectorFn(store.getSnapshot()),
    store.getServerSnapshot
      ? () => selectorFn(store.getServerSnapshot!())
      : undefined
  );

  return selectedState;
}
