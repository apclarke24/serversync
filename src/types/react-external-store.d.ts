/**
 * Type declarations for use-sync-external-store/shim
 */

declare module 'use-sync-external-store/shim' {
  export function useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T
  ): T;
}
