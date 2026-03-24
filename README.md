# Next-Shop

Full-stack ecommerce system built with **Spring Boot + Next.js**, focusing on **checkout consistency, inventory control, and concurrency handling**.

---

## 🧱 Architecture

```
Frontend (Next.js, Zustand)
        ↓
Backend (Spring Boot, JPA)
        ↓
PostgreSQL (Supabase)
```

* Frontend handles UI, cart state, and API calls
* Backend handles business logic, transactions, and consistency
* Database ensures persistence and concurrency safety

---

## 🚀 Core Features

### 🛒 Ecommerce Flow

* Product catalog
* Shopping cart (quantity merge)
* Checkout system
* Order lifecycle (PENDING → PAID → CANCELLED)

### ⚙️ System Design Highlights

* **Idempotent checkout** (prevents duplicate orders)
* **Inventory consistency**

  * Deduct on checkout
  * Restore on expiration
* **Order expiration system**

  * Auto-cancel PENDING orders
  * Scheduled stock recovery
* **Payment decoupling**

  * Checkout independent from payment provider
* **Concurrency tested**

  * Stable up to ~20 concurrent requests (Supabase Free tier)

---

## 🧪 Load Testing

Tested with custom script:

```bash
cd backend
CONCURRENCY=20 node load-test-with-consistency.js
```

Result:

* ✅ 20 concurrent → stable (0 failures)
* ⚠️ 50 concurrent → connection pool exhaustion (expected on free DB)

---

## 🚦 Rate Limiting Strategy

To protect the checkout API from surges, we've implemented an **In-Memory Concurrency Limiter**:

*   **Current implementation**: `java.util.concurrent.Semaphore` (max 10 permits).
*   **Behavior**:
    *   Requests wait up to **2 seconds** for a slot.
    *   If no slot is available after 2s, returns **HTTP 429 Too Many Requests**.
*   **⚠️ Scalability Limitation**:
    *   This is an **in-memory** solution (local to the JVM).
    *   It is not suitable for horizontally scaled clusters, as the limit is applied per-instance rather than globally.
*   **Future improvements**:
    *   Move to **distributed rate limiting** using Redis (Bucket4j/Redisson).
    *   Or offload rate limiting to an **API Gateway** level.

---

## 🛠 Tech Stack

### Backend

* Spring Boot 3
* JPA / Hibernate
* PostgreSQL (Supabase)

### Frontend

* Next.js
* Zustand
* Tailwind CSS

---

## 📦 Setup

### Backend

```bash
cd backend
./mvnw clean compile
./mvnw spring-boot:run
```

Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

---

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

---

## 📌 Notes

* Designed for **correctness over raw throughput**
* Current bottleneck: DB connection pool (Supabase Free tier)
* Future improvements:

  * Rate limiting
  * Inventory reservation model
  * Queue-based checkout processing

---
