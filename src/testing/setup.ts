/**
 * Jest testing setup
 */

import "@testing-library/jest-dom";

// Mock useSyncExternalStore for older React versions in tests
jest.mock("use-sync-external-store/shim", () => ({
  useSyncExternalStore: jest.fn((subscribe, getSnapshot, getServerSnapshot) => {
    // Simple mock implementation for testing
    const [state, setState] = require("react").useState(getSnapshot());

    require("react").useEffect(() => {
      const unsubscribe = subscribe(() => {
        setState(getSnapshot());
      });
      return unsubscribe;
    }, [subscribe, getSnapshot]);

    return state;
  }),
}));

// Suppress console errors in tests unless debugging
if (!process.env.DEBUG) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("[ServerSync]")) {
      return; // Suppress ServerSync errors in tests
    }
    originalError(...args);
  };
}
