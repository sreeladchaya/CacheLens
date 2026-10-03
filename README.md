# CacheLens ⚡

### Custom Cache Library + Real-Time Monitoring Dashboard

CacheLens is a custom in-memory caching system built with Java and Spring Boot, with a React-based dashboard for monitoring cache performance in real time.

It demonstrates how modern caching systems manage frequently accessed data using eviction policies, TTL expiration, thread-safe operations, and performance metrics.

---

## 🚀 Features

- ⚡ Fast in-memory caching
- 🔄 GET and PUT cache operations
- 🧠 LRU (Least Recently Used) eviction
- 📊 LFU (Least Frequently Used) eviction
- ⏱️ TTL (Time To Live) based expiration
- 🔒 Thread-safe cache operations
- 📈 Cache hit/miss tracking
- 📉 Hit-rate calculation
- 🗑️ Eviction tracking
- 🎛️ Runtime cache policy selection
- 🖥️ Interactive React dashboard
- 📡 REST API based architecture

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │   React Dashboard    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot       │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Cache Engine      │
                    │                      │
                    │  LRU / LFU / TTL     │
                    │  Hit / Miss Metrics  │
                    │  Thread Safety       │
                    └──────────────────────┘
