/**
 * Core store functionality tests
 */

import { createStoreAPI } from "../core";

describe("createStoreAPI", () => {
  it("should create a store with initial state", () => {
    const store = createStoreAPI({ count: 0, name: "test" });

    expect(store.getState()).toEqual({ count: 0, name: "test" });
    expect(store.getSnapshot()).toEqual({ count: 0, name: "test" });
  });

  it("should update state when setState is called", () => {
    const store = createStoreAPI({ count: 0 });

    store.setState({ count: 1 });

    expect(store.getState()).toEqual({ count: 1 });
  });

  it("should update state with updater function", () => {
    const store = createStoreAPI({ count: 0 });

    store.setState((state) => ({ count: state.count + 1 }));

    expect(store.getState()).toEqual({ count: 1 });
  });

  it("should notify subscribers when state changes", () => {
    const store = createStoreAPI({ count: 0 });
    const listener = jest.fn();

    const unsubscribe = store.subscribe(listener);

    store.setState({ count: 1 });

    expect(listener).toHaveBeenCalledTimes(1);

    // Should not notify after unsubscribe
    unsubscribe();
    store.setState({ count: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should not notify subscribers if state does not change", () => {
    const store = createStoreAPI({ count: 0 });
    const listener = jest.fn();

    store.subscribe(listener);

    // Set same state
    store.setState({ count: 0 });

    expect(listener).not.toHaveBeenCalled();
  });

  it("should handle multiple subscribers", () => {
    const store = createStoreAPI({ count: 0 });
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setState({ count: 1 });

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("should handle errors in listeners gracefully", () => {
    const store = createStoreAPI({ count: 0 });
    const errorListener = jest.fn(() => {
      throw new Error("Listener error");
    });
    const goodListener = jest.fn();

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    store.subscribe(errorListener);
    store.subscribe(goodListener);

    store.setState({ count: 1 });

    expect(errorListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[ServerSync] Error in state listener:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should cleanup listeners on destroy", () => {
    const store = createStoreAPI({ count: 0 });
    const listener = jest.fn();

    store.subscribe(listener);
    store.destroy();

    store.setState({ count: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  it("should return server snapshot for SSR", () => {
    const store = createStoreAPI(
      { count: 0 },
      {
        ssr: {
          initialState: { count: 5 },
        },
      }
    );

    expect(store.getSnapshot()).toEqual({ count: 0 });
    expect(store.getServerSnapshot?.()).toEqual({ count: 5 });
  });
});
