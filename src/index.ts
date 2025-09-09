/**
 * ServerSync - Next-generation state management for React
 *
 * Features:
 * - React 18/19 concurrent rendering support
 * - Server Components ready
 * - TypeScript-first design
 * - Zero-configuration DevTools
 * - Minimal boilerplate
 */

// Main API
export { createStore, createAdvancedStore } from "./store/createStore";
export { createStoreAPI } from "./store/core";

// Hooks
export { useStore, createStoreHook } from "./hooks/useStore";

// Types
export type {
  StoreState,
  StateUpdater,
  ActionFunction,
  StoreActions,
  StoreDefinition,
  StoreAPI,
  StoreHook,
  Middleware,
  StoreOptions,
  ServerStateContext,
} from "./types";

// Version
export const version = "0.1.0";

// Middleware (to be implemented)
// export { logger, persist, devtools } from './middleware';

// Server Components support (to be implemented)
// export { useServerState, useClientState } from './server';

// Testing utilities (to be implemented)
// export { createTestStore, mockServerState } from './testing';

// Import for default export
import { createStore, createAdvancedStore } from "./store/createStore";
import { createStoreAPI } from "./store/core";
import { useStore, createStoreHook } from "./hooks/useStore";

// Default export for convenience
const ServerSync = {
  createStore,
  createAdvancedStore,
  createStoreAPI,
  useStore,
  createStoreHook,
  version,
};

export default ServerSync;
