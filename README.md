# archyprompt

A cross-platform desktop application for selecting project files and generating structured XML prompts for AI agents. Built with Electron, Vue 3, and TypeScript.

---

## Tech Stack

| Tool | Role |
|---|---|
| **Electron** | Cross-platform desktop runtime (Windows, macOS, Linux) |
| **electron-vite** | Build tooling and dev server for Electron projects |
| **Vue 3** | UI framework — Composition API with `<script setup>` |
| **TypeScript** | Type safety across main process, preload, and renderer |
| **Pinia** | State management for the renderer (Vue-native store) |
| **Tailwind CSS v4** | Utility-first styling via the `@tailwindcss/vite` plugin |

---

## Project Structure

The project follows a **feature-based modular architecture**. Instead of grouping files by technical type (all components together, all stores together), files are grouped by the domain they belong to. Each feature is self-contained.

```
archyprompt/
├── electron-builder.yml          # Packaging config (installers for each OS)
├── electron.vite.config.ts       # Vite config — three sections: main / preload / renderer
├── package.json
├── tsconfig.json                 # Root — references node and web configs
├── tsconfig.node.json            # TypeScript config for main + preload (Node environment)
├── tsconfig.web.json             # TypeScript config for renderer (browser environment)
├── resources/                   # App icons and static assets
└── src/
    ├── main/                     # Electron main process (Node.js — full system access)
    │   ├── index.ts              # App lifecycle, BrowserWindow creation
    │   ├── ipc.ts                # IPC handler registration (bridges UI ↔ system)
    │   └── store.ts              # JSON-file persistence for project data
    ├── preload/                  # Preload script (sandboxed bridge layer)
    │   ├── index.ts              # Exposes window.api via contextBridge
    │   └── index.d.ts            # TypeScript types for window.api
    └── renderer/                 # Renderer process (Vue app — browser-like environment)
        ├── index.html
        └── src/
            ├── main.ts           # Vue app bootstrap, Pinia registration
            ├── App.vue           # Root layout: sidebar + main content area
            ├── env.d.ts
            ├── assets/
            │   └── main.css      # Global styles — Tailwind entry point
            ├── features/         # Feature modules (one folder per domain)
            │   └── projects/     # Everything related to project management
            │       ├── types.ts                        # Project interface
            │       ├── stores/
            │       │   └── projects.ts                 # Pinia store
            │       └── components/
            │           ├── AppSidebar.vue              # Sidebar container, edit mode state
            │           ├── ProjectList.vue             # Renders the project list
            │           ├── ProjectListItem.vue         # Single project row + checkbox
            │           └── AddProjectButton.vue        # "Add New Project" button
            └── shared/           # Cross-feature reusable code (future)
                ├── components/   # Generic UI components (buttons, modals, icons)
                └── utils/        # Shared utility functions
```

### Why feature-based?

As the app grows, new domains (e.g. `prompt-builder`, `file-tree`, `settings`) each get their own folder under `features/`. All the logic, components, and state for that domain live together — making it easy to find, extend, or remove features without touching unrelated code. Truly shared UI (generic buttons, icon wrappers) lives in `shared/`.

### Electron process model

There are three distinct execution contexts:

- **Main process** (`src/main/`) — runs Node.js, has full OS access (file system, dialogs, etc.). Never touches the DOM.
- **Preload** (`src/preload/`) — runs in a sandboxed context with access to both Node and browser APIs. Its sole job is to expose a safe, typed `window.api` bridge to the renderer via `contextBridge`.
- **Renderer** (`src/renderer/`) — the Vue app. Runs in a browser-like sandbox. All system operations go through `window.api` (never direct Node access).

---

## Development Log

---

### Phase 1 — Project Skeleton & Sidebar

**Goal:** Establish the foundational structure of the app: scaffolding, process architecture, and a functional project management sidebar.

**What was added:**

- Full project scaffold (electron-vite + Vue 3 + TypeScript + Tailwind CSS v4 + Pinia)
- Main process lifecycle setup with `BrowserWindow` creation
- JSON-file persistence layer — projects stored at `{userData}/projects.json` with atomic writes
- IPC handlers for listing, adding, and deleting projects — `projects:list`, `projects:add`, `projects:delete`
- Native OS folder picker via `dialog.showOpenDialog` (cross-platform)
- `contextBridge` preload API exposing `window.api` to the renderer
- Pinia store for renderer-side project state
- Sidebar UI with:
  - Project list with empty state message
  - "Add New Project" button with folder icon
  - Edit mode toggled by a pen icon — shows checkboxes on each project
  - "Delete Selected" button (disabled until a project is checked, red when active)
  - Cancel edit mode via X icon

**Files introduced:**

| File | Description |
|---|---|
| [`src/main/index.ts`](src/main/index.ts) | App entry, BrowserWindow setup |
| [`src/main/ipc.ts`](src/main/ipc.ts) | IPC handler registration |
| [`src/main/store.ts`](src/main/store.ts) | JSON persistence — load, save, add, delete |
| [`src/preload/index.ts`](src/preload/index.ts) | `window.api` bridge via contextBridge |
| [`src/preload/index.d.ts`](src/preload/index.d.ts) | TypeScript types for `window.api` |
| [`src/renderer/src/features/projects/types.ts`](src/renderer/src/features/projects/types.ts) | `Project` interface |
| [`src/renderer/src/features/projects/stores/projects.ts`](src/renderer/src/features/projects/stores/projects.ts) | Pinia store — state and actions |
| [`src/renderer/src/features/projects/components/AppSidebar.vue`](src/renderer/src/features/projects/components/AppSidebar.vue) | Sidebar container, owns edit mode |
| [`src/renderer/src/features/projects/components/ProjectList.vue`](src/renderer/src/features/projects/components/ProjectList.vue) | Project list renderer |
| [`src/renderer/src/features/projects/components/ProjectListItem.vue`](src/renderer/src/features/projects/components/ProjectListItem.vue) | Single project row with checkbox |
| [`src/renderer/src/features/projects/components/AddProjectButton.vue`](src/renderer/src/features/projects/components/AddProjectButton.vue) | Add project button |
| [`src/renderer/src/App.vue`](src/renderer/src/App.vue) | Root layout — sidebar + main area |
| [`src/renderer/src/assets/main.css`](src/renderer/src/assets/main.css) | Tailwind CSS entry point |

---
