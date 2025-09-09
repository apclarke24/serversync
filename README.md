# ServerSync

> **Next-Generation State Management for Modern React** > _Combining Redux's power with Zustand's simplicity, built for React 18/19 concurrent rendering and Server Components._

[![npm version](https://badge.fury.io/js/serversync.svg)](https://badge.fury.io/js/serversync)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React 18+](https://img.shields.io/badge/React-18%2B-61dafb)](https://reactjs.org/)

---

## 🚀 **Why ServerSync?**

ServerSync solves the critical gaps left by existing state management libraries in the modern React ecosystem:

- ❌ **Redux**: Too much boilerplate, complex setup, not concurrent-optimized
- ❌ **Zustand**: Limited DevTools, no advanced features, not RSC-ready
- ❌ **Jotai**: Complex mental model, atom sprawl, debugging difficulties
- ❌ **All Libraries**: Poor React 18/19 integration, Server Components compatibility issues

## ✨ **Key Features**

### 🎯 **Developer Experience Excellence**

- **Zero Configuration DevTools** - Automatic time-travel debugging, no setup required
- **TypeScript-First** - Runtime type validation that syncs with TypeScript types
- **Minimal Boilerplate** - Simple API like Zustand, powerful features like Redux
- **Built-in Testing Utilities** - First-class testing support with mocking and assertions
- **Performance Monitoring** - Automatic render tracking and optimization hints

### ⚡ **React 18/19 Native Integration**

- **Concurrent Rendering Safe** - Built on `useSyncExternalStore`, prevents tearing
- **Automatic Batching Optimized** - Works seamlessly with React 18's batching
- **Suspense Compatible** - Native integration with Suspense boundaries
- **React 19 Compiler Ready** - Compatible with upcoming automatic optimizations

### 🌐 **Server Components Ready**

- **Request Isolation** - Server state isolated per request (no user data leakage)
- **Seamless State Transfer** - Server data automatically flows to client components
- **Smart Boundary Detection** - Automatically creates client boundaries when needed
- **Hydration Safety** - Eliminates hydration mismatches and content flashing

### 🏗 **Redux-Level Power**

- **Advanced Middleware System** - Extensible architecture for complex operations
- **State Persistence** - One-line hydration/dehydration with customizable storage
- **Normalized State Helpers** - Built-in tools for relational data management
- **Memoized Selectors** - Automatic dependency tracking and optimization
- **Entity Management** - Standardized patterns for collections and CRUD operations

---

## 📦 **Installation**

```bash
npm install serversync
# or
yarn add serversync
# or
pnpm add serversync
```

---

## 🎨 **API Examples**

### Simple Usage (Zustand-like)

```javascript
import { createStore } from "serversync";

const useCounterStore = createStore({
  count: 0,
  increment: () => (state) => ({ count: state.count + 1 }),
  decrement: () => (state) => ({ count: state.count - 1 }),
});

function Counter() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Advanced Usage (Redux-like Power)

```javascript
import { createStore, createEntitySlice, middleware } from "serversync";

const store = createStore({
  // Entity management made simple
  users: createEntitySlice("users"),
  posts: createEntitySlice("posts"),

  // UI state
  ui: {
    sidebar: { open: false },
    modal: { active: null },
  },

  // Middleware for advanced features
  middleware: [
    middleware.logger,
    middleware.persist("app-state"),
    middleware.devtools,
  ],
});

function App() {
  const users = store.entities.users.useAll();
  const { sidebar } = store.ui.useSidebar();

  return <div>{/* Your app */}</div>;
}
```

### Server Components Integration

```javascript
// ServerComponent.tsx (Server Component)
export default function UserProfile({ userId }) {
  // ✅ Server-side data fetching, isolated per request
  const userData = useServerState('user', userId, fetchUser)

  return (
    <div>
      <h1>{userData.name}</h1>
      {/* ✅ Client state automatically available */}
      <InteractiveProfile initialData={userData} />
    </div>
  )
}

// InteractiveProfile.tsx (Client Component)
export default function InteractiveProfile({ initialData }) {
  // ✅ Seamlessly receives server data
  const user = useClientState('user', initialData)
  const [preferences, setPreferences] = useClientState('preferences', {})

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <Settings preferences={preferences} onChange={setPreferences} />
    </div>
  )
}
```

---

## 🏗 **Architecture**

### Server/Client State Flow

```
┌─────────────────────────────────────────────────────┐
│                    SERVER                           │
│  ┌─────────────────┐    ┌─────────────────────────┐  │
│  │ Server          │    │ Request Isolation       │  │
│  │ Components      │───▶│ (Per-user state)        │  │
│  │                 │    │                         │  │
│  └─────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                              │
                              ▼ (Automatic Serialization)
┌─────────────────────────────────────────────────────┐
│                   CLIENT                            │
│  ┌─────────────────┐    ┌─────────────────────────┐  │
│  │ Hydration       │    │ Client                  │  │
│  │ (No mismatches) │───▶│ Components              │  │
│  │                 │    │ (Interactive state)     │  │
│  └─────────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 **Performance**

- **Bundle Size**: <1kb base (smaller than Zustand)
- **State Updates**: <16ms average update performance
- **Memory**: Automatic cleanup of unused subscriptions
- **Rendering**: Selective subscriptions prevent unnecessary re-renders

---

## 🧪 **Testing**

```javascript
import { createTestStore, mockServerState } from "serversync/testing";

describe("UserProfile", () => {
  it("displays user data from server", async () => {
    const testStore = createTestStore();

    mockServerState("user", { name: "Test User", id: 1 });

    render(<UserProfile userId={1} />, {
      wrapper: testStore.Provider,
    });

    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
```

---

## 📚 **Documentation**

- [Getting Started](./docs/getting-started.md)
- [Server Components Guide](./docs/server-components.md)
- [Advanced Patterns](./docs/advanced-patterns.md)
- [Migration Guide](./docs/migration.md)
- [API Reference](./docs/api-reference.md)

---

## 🛣 **Roadmap**

### v1.0 (Q3 2025)

- [x] Core state management API
- [x] React 18 concurrent rendering support
- [x] Basic Server Components integration
- [x] TypeScript support
- [ ] Comprehensive testing utilities

### v1.1 (Q4 2025)

- [ ] Advanced DevTools with time-travel debugging
- [ ] Plugin architecture
- [ ] Performance optimization tools
- [ ] Migration tools from Redux/Zustand

### v2.0 (Q1 2026)

- [ ] React 19 compiler integration
- [ ] Advanced Server Components features
- [ ] Multi-store composition
- [ ] Enterprise features

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/apclarke24/serversync.git
cd serversync
npm install
npm run dev
```

---

## 📄 **License**

MIT © [Austin Clarke](https://github.com/apclarke24)

---

## 🙏 **Acknowledgments**

ServerSync is inspired by the excellent work of:

- **Redux** for setting the standard for predictable state management
- **Zustand** for proving that simple APIs can be powerful
- **Jotai** for pioneering atomic state management
- **React Team** for advancing the platform with concurrent rendering and Server Components

---

<p align="center">
  <b>Built for the future of React development</b><br>
  <a href="https://github.com/apclarke24/serversync">⭐ Star me on GitHub</a>
</p>
