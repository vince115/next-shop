# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo with three top-level directories:

- `frontend/` — Next.js 15 app (App Router, TypeScript, Tailwind CSS)
- `backend/` — Spring Boot 3.5 REST API (Java 21, JPA + Hibernate)
- `database/` — Reserved for migrations/seeds (currently empty)

---

## Development Commands

### Frontend (`frontend/`)

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

Environment: `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (`backend/`)

```bash
./mvnw spring-boot:run   # Start API server (http://localhost:8080)
./mvnw compile           # Compile only
./mvnw test              # Run tests
```

Environment: `backend/.env` (gitignored — copy from `backend/.env.example`)
```
DB_URL=jdbc:postgresql://<host>:<port>/<database>
DB_USERNAME=
DB_PASSWORD=
```

The `.env` file is auto-loaded at startup via `spring-dotenv`. Java 21 must be active (`JAVA_HOME` points to `/opt/homebrew/opt/openjdk@21`).

---

## Architecture

### Backend (`com.nextshop.backend`)

Each domain lives in its own package following the same pattern:

| Layer | Role |
|---|---|
| `*Entity*.java` | JPA entity, `@PrePersist` / `@PreUpdate` for timestamps |
| `*Repository.java` | Spring Data JPA — custom JPQL queries where needed |
| `*Service.java` | `@Transactional(readOnly=true)` by default, write methods override |
| `*Controller.java` | `@RestController`, `@Valid` on all request bodies |
| `*Request.java` | Input DTO with Bean Validation annotations |
| `*Response.java` | Output record — entities are never returned directly |

**Packages:**
- `product` — Product CRUD (`/api/products`, paginated)
- `cart` — Cart and CartItem management (`/api/cart`)
- `exception` — `GlobalExceptionHandler` returns RFC 9457 `ProblemDetail` for 404s and validation errors

**Cart domain relationships:**
- `Cart` 1:N `CartItem` (cascade all, orphanRemoval)
- `CartItem` N:1 `Product`
- `CartRepository.findByIdWithItems()` fetch-joins items + products in one query to avoid N+1
- Adding a duplicate product to a cart merges quantities rather than inserting a new row

**Database:** PostgreSQL on Supabase. `ddl-auto=update` — Hibernate manages the schema automatically.

### Frontend (`src/`)

- **`app/`** — App Router pages. Server components by default; only interactive pages use `"use client"`.
- **`components/`** — `ProductCard` (client), `Navbar` (client, reads cart count), `CartInitializer` (mounts cart on load)
- **`store/cartStore.ts`** — Zustand store, persists `cartId` to `localStorage`, re-fetches full cart state from API on load
- **`lib/api.ts`** — Product fetching (server-side, ISR revalidate 60s)
- **`lib/cartApi.ts`** — Cart API calls (client-side)
- **`types/`** — `product.ts`, `cart.ts` — TypeScript interfaces matching backend response shapes

**Pages:**
- `/` → redirects to `/products`
- `/products` — server component, product grid (4-col desktop / 2-col tablet / 1-col mobile), pagination
- `/cart` — client component, table layout with quantity controls and remove
- `/checkout` — client component, order summary skeleton with Place Order button
