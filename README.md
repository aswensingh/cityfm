# CityFM — Task Management Portal

A task management web application built with **Angular 21** and **ng-zorro-antd**.

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | 18.x or later |
| npm | 9.x or later (comes with Node.js) |
| Angular CLI | 21.x (installed via `npx`, no global install needed) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aswensingh/cityfm.git
cd cityfm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm start
```

The app will be available at **http://localhost:4200**.

---

## Login Credentials

The app uses mock authentication. Use the following credentials:

| Username | Password |
|----------|----------|
| `admin` | `Admin@123` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the dev server at `http://localhost:4200` |
| `npm run build` | Build for production (output in `dist/cityfm`) |

---

## Project Structure

```
src/
├── app/
│   ├── layout/               # Shell layout (sidebar, drawer, topbar)
│   ├── models/               # TypeScript interfaces (Task, User)
│   ├── pages/
│   │   ├── dashboard/        # Dashboard with stats & recent tasks
│   │   ├── login/            # Login page with particle background
│   │   ├── task-create/      # Multi-step task creation wizard
│   │   ├── task-detail/      # Task detail view with icon banner
│   │   ├── task-edit/        # Edit task form
│   │   └── task-list/        # Task table with sorting & filtering
│   └── services/
│       ├── auth.service.ts   # Authentication & session management
│       ├── auth.guard.ts     # Route guard (redirects to login)
│       ├── task.service.ts   # Task CRUD operations (in-memory)
│       └── toast.service.ts  # Toast notification wrapper
├── assets/
│   ├── data/mock-data.json   # Mock data (users, tasks, form schema)
│   └── images/               # Logo and static assets
└── styles.scss               # Global styles
```

---

## Key Features

- **Responsive layout** — desktop sidebar + mobile drawer navigation
- **Dashboard** — stat cards, recent tasks table/cards
- **Task list** — sortable & filterable table (desktop) / cards (mobile)
- **Task creation** — multi-step wizard with validation
- **Task editing** — pre-populated form with date picker
- **Task detail** — collapsible sections, icon banner fallback
- **Route guard** — protects `/app/*` routes, redirects to login
- **Mock data** — all data loaded from `mock-data.json`, no backend needed

---

## Tech Stack

- **Angular 21** (standalone components, signals, new control flow)
- **ng-zorro-antd 21** (Ant Design component library)
- **tsparticles** (login page particle background)
- **TypeScript 5.9**

---

## Build for Production

```bash
npm run build
```

Output is generated in the `dist/cityfm` folder. Serve it with any static file server.

