/**
 * Main createStore API - the primary interface for ServerSync
 */

import { createStoreAPI } from "./core";
import { createStoreHook } from "../hooks/useStore";
import type {
  StoreState,
  StoreDefinition,
  StoreOptions,
  StoreAPI,
  StateUpdater,
} from "../types";

/**
 * Create a ServerSync store with the simple API
 *
 * @example
 * ```typescript
 * const useCounterStore = createStore({
 *   count: 0,
 *   increment: () => state => ({ count: state.count + 1 }),
 *   decrement: () => state => ({ count: state.count - 1 })
 * });
 * ```
 */
export function createStore<T extends StoreState>(
  definition: StoreDefinition<T> & T,
  options: StoreOptions<T> = {}
) {
  // Parse the definition to separate state from actions
  const { initialState, actions } = parseStoreDefinition(definition);

  // Create the core store
  const store = createStoreAPI(initialState, options);

  // Create the React hook
  const useStore = createStoreHook(store);

  // Bind actions to the store
  const boundActions = bindActionsToStore(store, actions);

  // Create the public API
  const storeWithActions = Object.assign(useStore, {
    // Direct store access
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe,
    destroy: store.destroy,

    // Bound actions
    ...boundActions,

    // Internal store reference (for advanced use cases)
    _store: store,
  });

  return storeWithActions;
}

/**
 * Parse store definition into state and actions
 */
function parseStoreDefinition<T extends StoreState>(
  definition: StoreDefinition<T> & T
): {
  initialState: T;
  actions: Record<string, (...args: any[]) => StateUpdater<T>>;
} {
  const initialState = {} as T;
  const actions = {} as Record<string, (...args: any[]) => StateUpdater<T>>;

  for (const [key, value] of Object.entries(definition)) {
    if (typeof value === "function") {
      // This is an action
      actions[key] = value as (...args: any[]) => StateUpdater<T>;
    } else {
      // This is state
      (initialState as any)[key] = value;
    }
  }

  return { initialState, actions };
}

/**
 * Bind actions to store setState
 */
function bindActionsToStore<T extends StoreState>(
  store: StoreAPI<T>,
  actions: Record<string, (...args: any[]) => StateUpdater<T>>
): Record<string, (...args: any[]) => void> {
  const boundActions = {} as Record<string, (...args: any[]) => void>;

  for (const [key, action] of Object.entries(actions)) {
    boundActions[key] = (...args: any[]) => {
      try {
        const updater = action(...args);
        store.setState(updater);
      } catch (error) {
        console.error(`[ServerSync] Error in action "${key}":`, error);
        throw error;
      }
    };
  }

  return boundActions;
}

/**
 * Advanced store creation with explicit state/actions separation
 *
 * @example
 * ```typescript
 * const store = createAdvancedStore({
 *   initialState: { count: 0 },
 *   actions: {
 *     increment: () => state => ({ count: state.count + 1 })
 *   },
 *   options: { name: 'counter', devtools: true }
 * });
 * ```
 */
export function createAdvancedStore<T extends StoreState>(config: {
  initialState: T;
  actions?: Record<string, (...args: any[]) => StateUpdater<T>>;
  options?: StoreOptions<T>;
}) {
  const { initialState, actions = {}, options = {} } = config;

  // Create the core store
  const store = createStoreAPI(initialState, options);

  // Create the React hook
  const useStore = createStoreHook(store);

  // Bind actions
  const boundActions = bindActionsToStore(store, actions);

  return Object.assign(useStore, {
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe,
    destroy: store.destroy,
    ...boundActions,
    _store: store,
  });
}
