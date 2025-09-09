/**
 * Core store implementation with useSyncExternalStore integration
 */

import type {
  StoreState,
  StoreDefinition,
  StoreAPI,
  StateUpdater,
  StoreOptions,
  Middleware,
} from "../types";

// Global store registry for development tools
const storeRegistry = new Map<string, StoreAPI<any>>();
let storeIdCounter = 0;

export function createStoreAPI<T extends StoreState>(
  initialState: T,
  options: StoreOptions<T> = {}
): StoreAPI<T> {
  const storeId = `store_${++storeIdCounter}`;
  const storeName = options.name || storeId;

  let state = { ...initialState };
  const listeners = new Set<() => void>();

  // Middleware chain
  const middleware = options.middleware || [];

  // Core API methods
  const api: StoreAPI<T> = {
    getState: () => state,

    setState: (updater: StateUpdater<T> | Partial<T>) => {
      const nextState =
        typeof updater === "function"
          ? { ...state, ...updater(state) }
          : { ...state, ...updater };

      // Only update if state actually changed
      if (!shallowEqual(state, nextState)) {
        state = nextState;

        // Notify all subscribers
        listeners.forEach((listener) => {
          try {
            listener();
          } catch (error) {
            console.error("[ServerSync] Error in state listener:", error);
          }
        });
      }
    },

    subscribe: (listener: () => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    getSnapshot: () => state,

    getServerSnapshot: () => {
      // For SSR, return the initial or hydrated state
      return options.ssr?.initialState
        ? { ...initialState, ...options.ssr.initialState }
        : state;
    },

    destroy: () => {
      listeners.clear();
      storeRegistry.delete(storeId);
    },
  };

  // Apply middleware
  if (middleware.length > 0) {
    const originalSetState = api.setState;

    // Build middleware chain (right to left)
    const middlewareChain = middleware.reduceRight(
      (next, mw) => mw(api)(next),
      originalSetState
    );

    api.setState = middlewareChain;
  }

  // Register store for dev tools
  if (options.devtools !== false) {
    storeRegistry.set(storeId, api);

    // Add to global registry for devtools
    if (typeof window !== "undefined") {
      (window as any).__SERVERSYNC_STORES__ = storeRegistry;
    }
  }

  return api;
}

/**
 * Create a store from a definition object
 */
export function createStore<T extends StoreState>(
  definition: StoreDefinition<T> & T,
  options: StoreOptions<T> = {}
) {
  // Separate state from actions
  const { actions, initialState } = parseStoreDefinition(definition);

  // Create the core store API
  const store = createStoreAPI(initialState, options);

  // Bind actions to the store
  const boundActions = bindActions(store, actions);

  return {
    ...store,
    ...boundActions,
  };
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
function bindActions<T extends StoreState>(
  store: StoreAPI<T>,
  actions: Record<string, (...args: any[]) => StateUpdater<T>>
): Record<string, (...args: any[]) => void> {
  const boundActions = {} as Record<string, (...args: any[]) => void>;

  for (const [key, action] of Object.entries(actions)) {
    boundActions[key] = (...args: any[]) => {
      const updater = action(...args);
      store.setState(updater);
    };
  }

  return boundActions;
}

/**
 * Shallow equality check for state comparison
 */
function shallowEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(b, keysA[i]) ||
      !Object.is(a[keysA[i]], b[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
