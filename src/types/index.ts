/**
 * Core type definitions for ServerSync
 */

// Base state type - any JSON-serializable object
export type StateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | StateValue[]
  | { [key: string]: StateValue };

// Store state can be any object with string keys
export type StoreState = Record<string, StateValue>;

// State updater function type
export type StateUpdater<T extends StoreState> = (state: T) => Partial<T>;

// Action function type - returns a state updater
export type ActionFunction<T extends StoreState, Args extends any[] = any[]> = (
  ...args: Args
) => StateUpdater<T>;

// Store actions definition
export type StoreActions<T extends StoreState> = Record<
  string,
  ActionFunction<T> | any
>;

// Complete store definition - can contain both state values and action functions
export type StoreDefinition<T extends StoreState> = T &
  Record<string, ActionFunction<T> | any>;

// Store API that gets returned from createStore
export interface StoreAPI<T extends StoreState> {
  // Get current state
  getState(): T;
  // Set state (internal use)
  setState(updater: StateUpdater<T> | Partial<T>): void;
  // Subscribe to changes
  subscribe(listener: () => void): () => void;
  // Get snapshot for useSyncExternalStore
  getSnapshot(): T;
  // Server-safe snapshot that can be serialized
  getServerSnapshot?(): T;
  // Destroy store and cleanup
  destroy(): void;
}

// Hook return type
export type StoreHook<T extends StoreState, Selected = T> = {
  (): Selected;
  <U>(selector: (state: T) => U): U;
};

// Middleware function type
export interface Middleware<T extends StoreState> {
  (api: StoreAPI<T>): (
    next: (updater: StateUpdater<T>) => void
  ) => (updater: StateUpdater<T>) => void;
}

// Store options
export interface StoreOptions<T extends StoreState> {
  // Middleware to apply
  middleware?: Middleware<T>[];
  // Enable dev tools (default: true in development)
  devtools?: boolean;
  // Store name for debugging
  name?: string;
  // Server-side rendering options
  ssr?: {
    // Initial state for hydration
    initialState?: Partial<T>;
    // Custom serialization
    serialize?: (state: T) => any;
    deserialize?: (serialized: any) => Partial<T>;
  };
}

// Server state context
export interface ServerStateContext {
  // Request-scoped state storage
  state: Map<string, any>;
  // Request ID for isolation
  requestId: string;
  // Cleanup functions
  cleanup: (() => void)[];
}
