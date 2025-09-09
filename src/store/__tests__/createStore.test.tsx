/**
 * createStore API tests
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { createStore } from "../createStore";

describe("createStore", () => {
  it("should create a store with state and actions", () => {
    const useCounterStore = createStore({
      count: 0,
      increment: () => (state) => ({ count: state.count + 1 }),
      decrement: () => (state) => ({ count: state.count - 1 }),
    });

    // Test direct API access
    expect(useCounterStore.getState()).toEqual({ count: 0 });

    // Test actions
    act(() => {
      useCounterStore.increment();
    });

    expect(useCounterStore.getState()).toEqual({ count: 1 });

    act(() => {
      useCounterStore.decrement();
    });

    expect(useCounterStore.getState()).toEqual({ count: 0 });
  });

  it("should work as a React hook", () => {
    const useCounterStore = createStore({
      count: 0,
      name: "test",
      increment: () => (state) => ({ count: state.count + 1 }),
    });

    function Counter() {
      const { count, name } = useCounterStore();
      return (
        <div>
          Count: {count}, Name: {name}
        </div>
      );
    }

    render(<Counter />);
    expect(screen.getByText("Count: 0, Name: test")).toBeInTheDocument();
  });

  it("should support selector functions", () => {
    const useCounterStore = createStore({
      count: 0,
      name: "test",
      increment: () => (state) => ({ count: state.count + 1 }),
    });

    function CounterDisplay() {
      const count = useCounterStore((state) => state.count);
      return <div>Count: {count}</div>;
    }

    render(<CounterDisplay />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("should handle complex state", () => {
    const useAppStore = createStore({
      user: { name: "John", id: 1 },
      posts: [],
      loading: false,
      setUser: (user: { name: string; id: number }) => (state) => ({
        ...state,
        user,
      }),
      addPost: (post: { id: number; title: string }) => (state) => ({
        ...state,
        posts: [...state.posts, post],
      }),
      setLoading: (loading: boolean) => (state) => ({
        ...state,
        loading,
      }),
    });

    // Test complex state updates
    expect(useAppStore.getState()).toEqual({
      user: { name: "John", id: 1 },
      posts: [],
      loading: false,
    });

    act(() => {
      useAppStore.setUser({ name: "Jane", id: 2 });
    });

    expect(useAppStore.getState().user).toEqual({ name: "Jane", id: 2 });

    act(() => {
      useAppStore.addPost({ id: 1, title: "Hello World" });
    });

    expect(useAppStore.getState().posts).toEqual([
      { id: 1, title: "Hello World" },
    ]);
  });

  it("should handle action errors gracefully", () => {
    const useErrorStore = createStore({
      count: 0,
      errorAction: () => () => {
        throw new Error("Action error");
      },
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      useErrorStore.errorAction();
    }).toThrow("Action error");

    expect(consoleSpy).toHaveBeenCalledWith(
      '[ServerSync] Error in action "errorAction":',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should support subscription and cleanup", () => {
    const useCounterStore = createStore({
      count: 0,
      increment: () => (state) => ({ count: state.count + 1 }),
    });

    const listener = jest.fn();
    const unsubscribe = useCounterStore.subscribe(listener);

    act(() => {
      useCounterStore.increment();
    });

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();

    act(() => {
      useCounterStore.increment();
    });

    // Should not call listener after unsubscribe
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
