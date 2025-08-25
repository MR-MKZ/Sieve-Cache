# 🌀 SIEVE Cache (TypeScript Implementation)

An experimental **TypeScript implementation** of the **SIEVE Cache** algorithm — a **modern cache replacement policy** designed in 2023.
This project demonstrates how **SIEVE** works using **Bun** as the runtime and [`@axonlabs/core`](https://github.com/AxonJsLabs/AxonJs) as the backend library for showcasing results.

---

## 📖 What is SIEVE?

**SIEVE** is a new cache algorithm created with the goal of being:

* ✅ **Simpler** than **LRU** (Least Recently Used)
* 🚀 **Higher performing** and more scalable
* 🎯 **Improved hit rate** and **practical usability**

Instead of using a *tail pointer* like LRU, **SIEVE** uses a **"hand" pointer** that walks through a **Key-Value Doubly Linked Queue** to decide which node to evict.

---

## ⚙️ How SIEVE Works

Each cache entry (node) has a `visited` flag (`0/1` or `false/true`):

1. **Cache hit** → `visited = true`

   * Means the data was used at least twice.
   * When the hand reaches it, `visited` will be reset to `false`, and the hand moves forward.

2. **Cache miss (insert new node)**

   * The hand traverses the queue.
   * If it finds a node with `visited = false`, that node gets **evicted**.
   * The new node is added to the **head** of the queue.

This mechanism makes SIEVE **faster, leaner, and fairer** compared to LRU.

---

## 🛠️ Tech Stack

* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Runtime:** [Bun](https://bun.sh/)
* **Backend:** [@axonlabs/core](https://github.com/AxonJsLabs/AxonJs)

---

## 📦 Installation

```bash
# clone the repo
git clone https://github.com/Mr-MKZ/Sieve-Cache.git
cd Sieve-Cache

# install dependencies
bun install
```

---

## 🚀 Usage

```ts
import { SieveCache } from "./Sieve.ts";

// Create a cache with capacity 3
const cache = new SieveCache<number>(3);

cache.set("a", 1);
cache.set("b", 2);
cache.set("c", 3);

console.log(cache.get("a")); // hit → 1
cache.set("d", 4);           // eviction triggered by SIEVE
```

Run with Bun:

```bash
bun run src/index.ts
or
bun start
```

---

## 📊 Example with @axonlabs/core

This project includes integration with `@axonlabs/core` to **benchmark and observe SIEVE behavior** in a backend context.

[Sample Usage](./src/index.ts)

---

## 🔬 Comparison: LRU vs SIEVE

| Feature                | LRU                      | SIEVE                       |
| ---------------------- | ------------------------ | --------------------------- |
| Eviction strategy      | Remove tail node         | Remove first unvisited node |
| Tracking overhead      | Needs full order updates | Simple `visited` bit        |
| Simplicity             | Moderate                 | High                        |
| Hit rate (benchmarked) | Good                     | Often better                |
| Real-world efficiency  | Well-known but aging     | New, promising              |

---

## 📜 License

MIT © 2025 — Built with ❤️ using **TypeScript + Bun + AxonJs**
