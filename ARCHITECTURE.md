# 🧱 Next Shop Architecture Guide

Version: v2.0 Last Updated: 2026-03-19

⚠️ This file is authoritative. ALL agents must follow these rules.

------------------------------------------------------------------------

## 🔄 Version History

### v2.0

-   Admin / Shop layout separation rules
-   Middleware auth strategy
-   API error handling standard
-   Stronger AI constraints

### v1.0

-   Initial architecture rules

------------------------------------------------------------------------

## 1. 🏗️ System Overview

Frontend: - Next.js (App Router) - TypeScript - TailwindCSS

Backend: - Spring Boot 3 - JPA / Hibernate - PostgreSQL

Architecture Flow: UI → API Module → apiFetch → Backend

------------------------------------------------------------------------

## 2. 🎨 Frontend Architecture

### Layout System

-   RootLayout MUST NOT render Navbar
-   Navbar controlled ONLY by LayoutShell
-   /admin uses separate layout logic

### Rules

-   DO NOT duplicate Navbar
-   DO NOT move Navbar into layout.tsx

------------------------------------------------------------------------

## 3. 🧩 Layout Separation (NEW)

### Shop Layout

-   Uses Navbar
-   Public UI

### Admin Layout

-   NO shop Navbar
-   Can have AdminNavbar

------------------------------------------------------------------------

## 4. 🌐 API Architecture

### Single Entry

All API calls must go through: `/src/lib/api.ts → apiFetch()`

### Forbidden

-   Direct fetch() in components

------------------------------------------------------------------------

## 5. 🔐 Authentication

-   Token stored in localStorage
-   apiFetch injects Authorization header

### Rules

-   DO NOT pass token manually

### 401

-   Clear token
-   Redirect to /login

------------------------------------------------------------------------

## 6. 🧾 Data Contract

Order: { id: number; order_items: OrderItem\[\]; total: number; status:
"pending" \| "paid" \| "cancelled" \| "failed"; created_at: string; }

Rules: - status lowercase - created_at ISO format

------------------------------------------------------------------------

## 7. 🖥️ Backend Rules

-   Use ISO datetime
-   Use snake_case fields

------------------------------------------------------------------------

## 8. 🧠 Middleware (NEW)

-   Protect /account and /admin routes
-   Redirect if no token

------------------------------------------------------------------------

## 9. 🚨 Critical Files

-   layout.tsx
-   LayoutShell.tsx
-   api.ts
-   AuthContext.tsx

DO NOT MODIFY without instruction

------------------------------------------------------------------------

## 10. 🛑 AI Rules

MUST: - Read this file - Follow rules

MUST NOT: - Break layout system - Bypass apiFetch - Break auth flow

------------------------------------------------------------------------

## 11. 🔥 Golden Rules

1.  No direct fetch
2.  Use apiFetch
3.  Navbar only in LayoutShell
4.  No manual token
5.  Follow data contract

------------------------------------------------------------------------

## 12. 🧪 Testing Strategy

### 🎯 Goals

- Ensure core flows are stable
- Prevent auth / API regressions
- Keep tests lightweight and maintainable

------------------------------------------------------------------------

### 🧩 Unit Testing (Vitest)

Scope:
- Utility functions
- API modules (/src/lib)
- Auth helpers (tokenStorage, authValidation)

Rules:
- DO NOT test UI rendering
- DO NOT test layout components
- DO test apiFetch behavior

Required Coverage:

✔ apiFetch:
- attaches Authorization header
- handles 401 correctly
- does NOT clear token incorrectly

✔ tokenStorage:
- set / get / clear token

✔ authValidation:
- token validity check

Example:

/src/lib/api.test.ts
/src/lib/auth/tokenStorage.test.ts

------------------------------------------------------------------------

### 🌐 E2E Testing (Playwright)

Scope:
- Critical user flows

Required Tests:

✔ Login Flow
- user can login
- token stored
- redirect works

✔ Protected Routes
- /account requires login
- /admin requires admin role

✔ Orders Flow
- open /account/orders
- does NOT logout unexpectedly
- API request includes Authorization

✔ Admin Access
- admin can access /admin/users
- non-admin is blocked (403 or redirect)

------------------------------------------------------------------------

### 🚨 Forbidden

- DO NOT mock apiFetch in E2E
- DO NOT bypass auth system
- DO NOT use test-only logic in production code

------------------------------------------------------------------------

### 🧠 Test Philosophy

- Test behavior, not implementation
- Focus on auth + API stability
- Avoid over-testing UI

------------------------------------------------------------------------

### 🔐 Auth Regression Protection

Every PR MUST pass:

- Login flow test
- /api/users/me returns valid user
- No unexpected 401 loops

If any of above fails → block merge

Enforcement:
- CI pipeline (Playwright)
- Manual verification if CI not available

------------------------------------------------------------------------
# END
