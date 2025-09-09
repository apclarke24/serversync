/**
 * Basic counter example demonstrating ServerSync usage
 */

import React from "react";
import { createStore } from "../src";

// Create a counter store
const useCounterStore = createStore({
  count: 0,
  increment: () => (state) => ({ count: state.count + 1 }),
  decrement: () => (state) => ({ count: state.count - 1 }),
  reset: () => () => ({ count: 0 }),
  incrementBy: (amount: number) => (state) => ({
    count: state.count + amount,
  }),
});

// Counter component
function Counter() {
  const { count } = useCounterStore();

  return (
    <div>
      <h2>Count: {count}</h2>
      <div>
        <button onClick={useCounterStore.increment}>+1</button>
        <button onClick={useCounterStore.decrement}>-1</button>
        <button onClick={() => useCounterStore.incrementBy(5)}>+5</button>
        <button onClick={useCounterStore.reset}>Reset</button>
      </div>
    </div>
  );
}

// Display component that only subscribes to count
function CounterDisplay() {
  const count = useCounterStore((state) => state.count);

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Is positive: {count > 0 ? "Yes" : "No"}</p>
    </div>
  );
}

// Control component
function CounterControls() {
  return (
    <div>
      <h3>Controls</h3>
      <button onClick={useCounterStore.increment}>Increment</button>
      <button onClick={useCounterStore.decrement}>Decrement</button>
      <button onClick={useCounterStore.reset}>Reset</button>
    </div>
  );
}

// Main app
export default function CounterApp() {
  return (
    <div>
      <h1>ServerSync Counter Example</h1>
      <Counter />
      <CounterDisplay />
      <CounterControls />

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>Debug Info</h3>
        <pre>{JSON.stringify(useCounterStore.getState(), null, 2)}</pre>
      </div>
    </div>
  );
}
