/**
 * Todo app example showing more complex state management
 */

import React, { useState } from "react";
import { createStore } from "../src";

// Todo type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Create todo store
const useTodoStore = createStore({
  todos: [] as Todo[],
  filter: "all" as "all" | "active" | "completed",

  addTodo: (text: string) => (state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date(),
      },
    ],
  }),

  toggleTodo: (id: number) => (state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }),

  deleteTodo: (id: number) => (state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  }),

  setFilter: (filter: "all" | "active" | "completed") => (state) => ({
    ...state,
    filter,
  }),

  clearCompleted: () => (state) => ({
    todos: state.todos.filter((todo) => !todo.completed),
  }),
});

// Add todo form
function AddTodoForm() {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      useTodoStore.addTodo(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        style={{ padding: "0.5rem", fontSize: "1rem", width: "300px" }}
      />
      <button type="submit" style={{ padding: "0.5rem", marginLeft: "0.5rem" }}>
        Add Todo
      </button>
    </form>
  );
}

// Todo item component
function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => useTodoStore.toggleTodo(todo.id)}
        style={{ marginRight: "0.5rem" }}
      />
      <span style={{ flex: 1 }}>{todo.text}</span>
      <button
        onClick={() => useTodoStore.deleteTodo(todo.id)}
        style={{ marginLeft: "0.5rem", color: "red" }}
      >
        Delete
      </button>
    </div>
  );
}

// Todo list with filtering
function TodoList() {
  const { todos, filter } = useTodoStore();

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div>
      {filteredTodos.length === 0 ? (
        <p>No todos found!</p>
      ) : (
        filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </div>
  );
}

// Filter controls
function FilterControls() {
  const filter = useTodoStore((state) => state.filter);

  const filters: Array<{ key: "all" | "active" | "completed"; label: string }> =
    [
      { key: "all", label: "All" },
      { key: "active", label: "Active" },
      { key: "completed", label: "Completed" },
    ];

  return (
    <div style={{ margin: "1rem 0" }}>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => useTodoStore.setFilter(f.key)}
          style={{
            padding: "0.5rem",
            margin: "0 0.25rem",
            backgroundColor: filter === f.key ? "#007bff" : "#f8f9fa",
            color: filter === f.key ? "white" : "black",
            border: "1px solid #ccc",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

// Stats component
function TodoStats() {
  const todos = useTodoStore((state) => state.todos);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const active = total - completed;

  return (
    <div
      style={{
        margin: "1rem 0",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "4px",
      }}
    >
      <p>
        Total: {total} | Active: {active} | Completed: {completed}
      </p>
      {completed > 0 && (
        <button onClick={useTodoStore.clearCompleted}>Clear Completed</button>
      )}
    </div>
  );
}

// Main todo app
export default function TodoApp() {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>ServerSync Todo App</h1>
      <AddTodoForm />
      <FilterControls />
      <TodoList />
      <TodoStats />
    </div>
  );
}
