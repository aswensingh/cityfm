# CityFM — High-Level Architecture

## Overview

CityFM is a **Single Page Application (SPA)** built with Angular 21, using standalone components, signals-based state management, and ng-zorro-antd as the UI component library. All data is served from a local mock JSON file — no backend required.

---

## 1. UI Composition Approach

**Pattern:** SPA with lazy-loaded standalone components

The app uses Angular Router with a **shell layout** pattern. `AppComponent` renders a single `<router-outlet>`. The `LayoutComponent` acts as the authenticated shell — providing the sidebar (desktop) and drawer (mobile) — with a nested `<router-outlet>` for child pages.

All page components are **lazy-loaded** via `loadComponent()` for optimal bundle splitting.

**Key decisions:**
- **SPA, not MPA or micro-frontends** — the app is small enough that a single Angular app is optimal
- **Standalone components** — no NgModules; each component declares its own imports
- **Lazy loading** — every page uses `loadComponent()` in routes for code splitting
- **Responsive shell** — `LayoutComponent` uses `BreakpointObserver` to switch between sidebar and drawer layouts

---

## 2. State Management Strategy

**Pattern:** Angular Signals in singleton services (no external library)

State is managed through **two service-level signal stores**: `TaskService` (tasks) and `AuthService` (user session). Components read state via `computed()` signals and mutate via service methods.

**Key decisions:**
- **Signals over NgRx** — the app's state is simple (tasks array + user); signals provide reactivity without boilerplate
- **`computed()` for derived state** — dashboard counts, filtered lists, and task lookups are all derived signals
- **Singleton services** — `providedIn: 'root'` ensures a single source of truth
- **Immutable updates** — `tasksSignal.update()` creates new array references

---

## 3. API Interaction Pattern

**Pattern:** Service layer → HttpClient → Mock JSON (designed to swap to REST API)

Currently, both `TaskService` and `AuthService` load data from `/assets/data/mock-data.json` via `HttpClient`. The architecture is designed so swapping to a real REST API only requires changing URLs and adding interceptors.

**Current implementation:**
- `TaskService.loadTasks()` → `HttpClient.get('/assets/data/mock-data.json')`
- `AuthService.login()` → same JSON file, filters users array
- All mutations (create/update) are in-memory only

**Production extension:**
- Replace JSON paths with `environment.apiUrl` + endpoints
- Add `withInterceptors([authInterceptor, errorInterceptor])` to `provideHttpClient()`
- Domain services remain unchanged — only HTTP URLs change

---

## 4. Authentication & Authorization Flow

**Pattern:** Session-based mock auth with route guards

The app uses a simple auth flow: login form → validate against mock data → store in sessionStorage → signal update → route guard checks signal.

**Current implementation:**
- Mock credentials validated client-side against `mock-data.json`
- Session persisted in `sessionStorage` (survives refresh, clears on tab close)
- `authGuard` is a functional guard using `inject(AuthService).isLoggedIn()`
- Wildcard route `**` redirects to `/login`

**Production extension:**
- Replace mock validation with POST to `/api/auth/login` → receive JWT
- Store token in `httpOnly` cookie or secure storage
- Add HTTP interceptor to attach `Authorization: Bearer <token>` header
- Add token refresh flow for expired tokens
- Add role-based `canActivate` guards for admin-only routes

---

## 5. Error Handling, Logging & Analytics

**Pattern:** Toast notifications + console errors (extensible to centralized logging)

**Current implementation:**
- `ToastService` wraps `NzMessageService` with typed methods (`success`, `error`, `warning`)
- Toast messages loaded from `mock-data.json` via `uiConfig.toasts`
- Form validation uses ng-zorro's `nzErrorTip` with inline error templates
- Bootstrap errors caught with `.catch(console.error)` in `main.ts`

**Production extension:**
- Implement Angular `ErrorHandler` class for global uncaught error capture
- Add HTTP error interceptor to catch 401 (redirect to login), 403, 500 etc.
- Centralized `LoggingService` that routes to console (dev) + remote (prod)
- Integrate Sentry/Application Insights for crash reporting
- Add analytics events for key user actions (login, task create, task edit)

---

## 6. Build & Deploy Pipeline

**Pattern:** Angular CLI build + GitHub Actions CI/CD

**Current implementation:**
- `ng build` via `@angular/build:application` builder
- Production budgets configured in `angular.json` (2 MB warn / 3 MB error)
- Output to `dist/cityfm` — ready for static hosting

---

## Architecture Summary

| Concern | Approach |
|---------|----------|
| **UI Composition** | SPA, standalone components, lazy-loaded routes, responsive shell layout |
| **State Management** | Angular Signals in singleton services, computed derivations |
| **API Interaction** | HttpClient → mock JSON (swappable to REST via interceptors) |
| **Authentication** | Session-based mock auth, functional route guard, extensible to JWT |
| **Error Handling** | ToastService for UX, console for dev, extensible to centralized logging |
| **Build/Deploy** | Angular CLI production build, GitHub Actions CI/CD, static hosting |

