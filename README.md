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
    │   ├── store.ts              # JSON-file persistence for project data
    │   ├── filesystem.ts         # Directory reader — filtering, sorting, lazy reads
    │   └── prompt.ts             # XML assembly — file/folder reading, prompt building
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
            │   ├── projects/     # Project management + file tree navigation
            │   │   ├── types.ts                        # Project + FileTreeEntry interfaces
            │   │   ├── stores/
            │   │   │   └── projects.ts                 # Pinia store — projects + file tree state
            │   │   └── components/
            │   │       ├── AppSidebar.vue              # Sidebar container — project list or file tree
            │   │       ├── ProjectList.vue             # Renders the project list
            │   │       ├── ProjectListItem.vue         # Single project row + checkbox
            │   │       ├── AddProjectButton.vue        # "Add New Project" button
            │   │       ├── FileTree.vue                # File tree container with back nav + scroll
            │   │       └── FileTreeNode.vue            # Recursive tree node — folders/files + context checkbox
            │   └── prompt-builder/   # Context aggregation and prompt assembly
            │       ├── types.ts                        # ContextEntry interface
            │       ├── stores/
            │       │   └── prompt.ts                   # Pinia store — context, assembly, metrics
            │       └── components/
            │           ├── PromptBuilder.vue           # Main content area — context + input + actions
            │           ├── ContextStack.vue            # Context card grid (top of main area)
            │           └── ContextCard.vue             # Individual file/folder card with remove button
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

### Phase 2 — File Tree Navigation

**Goal:** When a project is clicked in the sidebar, transition to a lazy-loaded, collapsible file tree view. The sidebar shows either the project list or the file tree — never both simultaneously. Deeply nested directories trigger horizontal scrolling.

**What was added:**

- New `FileTreeEntry` type (`name`, `path`, `isDirectory`) — the wire format for IPC directory reads
- Main process `filesystem.ts` — reads a single directory's contents, sorts (folders first, then files, alphabetically), and filters out common noise directories (`node_modules`, `.git`, `__pycache__`, `dist`, etc.)
- New IPC channel `fs:readDirectory` — accepts a directory path, validates it belongs to a known project (security guard), returns `FileTreeEntry[]`
- Pinia store extended with: `activeProject`, `directoryCache` (Map), `expandedPaths` (Set), `loadingPaths` (Set), and actions `selectProject`, `deselectProject`, `toggleDirectory`, `loadDirectory`
- Lazy loading: directories are only read on-demand when first expanded; collapsed then re-expanded uses the cache (instant)
- `ProjectListItem.vue` updated — clicking a project in non-edit mode emits `select` instead of doing nothing
- `FileTreeNode.vue` — recursive component. Renders a single file or folder row with depth-based indentation (via inline `paddingLeft` style). Folder rows have a rotating chevron. Shows a loading spinner while children are being fetched.
- `FileTree.vue` — tree container. Header with back arrow + project name. Scrollable area with `overflow-x-auto overflow-y-auto` and `min-w-max` inner div so deep nesting forces horizontal scroll.
- `AppSidebar.vue` updated — conditionally renders `<FileTree>` when a project is active, otherwise shows the project list

**Files introduced:**

| File | Description |
|---|---|
| [`src/main/filesystem.ts`](src/main/filesystem.ts) | Directory reader — filtering, sorting, error handling |
| [`src/renderer/src/features/projects/components/FileTree.vue`](src/renderer/src/features/projects/components/FileTree.vue) | File tree container with header and scroll |
| [`src/renderer/src/features/projects/components/FileTreeNode.vue`](src/renderer/src/features/projects/components/FileTreeNode.vue) | Recursive tree node — folder/file icons, expand/collapse |

**Files modified:**

| File | Change |
|---|---|
| [`src/main/ipc.ts`](src/main/ipc.ts) | Added `fs:readDirectory` handler with path validation |
| [`src/preload/index.ts`](src/preload/index.ts) | Exposed `readDirectory` on `window.api` |
| [`src/preload/index.d.ts`](src/preload/index.d.ts) | Added `FileTreeEntry` type and `readDirectory` method |
| [`src/renderer/src/features/projects/types.ts`](src/renderer/src/features/projects/types.ts) | Added `FileTreeEntry` interface |
| [`src/renderer/src/features/projects/stores/projects.ts`](src/renderer/src/features/projects/stores/projects.ts) | Extended with active project and file tree state |
| [`src/renderer/src/features/projects/components/ProjectListItem.vue`](src/renderer/src/features/projects/components/ProjectListItem.vue) | Added `select` emit for non-edit mode clicks |
| [`src/renderer/src/features/projects/components/ProjectList.vue`](src/renderer/src/features/projects/components/ProjectList.vue) | Passes through `select` event |
| [`src/renderer/src/features/projects/components/AppSidebar.vue`](src/renderer/src/features/projects/components/AppSidebar.vue) | Conditional rendering: file tree vs project list |
| [`tsconfig.web.json`](tsconfig.web.json) | Added preload `index.d.ts` to renderer TS includes |

---

### Phase 3 — Context-Aware Prompt Builder

**Goal:** Turn the main content area into a prompt builder. Users check files/folders in the file tree to build a context stack, write a query, and copy the assembled XML prompt to the clipboard. Live character and token metrics update as the context changes.

**What was added:**

- `prompt.ts` (main process) — recursive XML assembly. Folders expand to `<folder><file>content</file></folder>` structure. Files become `<filename>content</filename>`. Binary files (images, fonts, zips, etc.) are replaced with `[binary file]`. Tag names are sanitized. Ignored directories (`node_modules`, `.git`, etc.) are skipped recursively.
- New IPC channel `prompt:assemble` — accepts an array of `{path, isDirectory}`, returns `{xml, charCount, tokenEstimate}`
- New `prompt-builder` feature module with its own Pinia store, managing: context entry list, user query text, assembled XML, live char/token counts, and clipboard copy
- **Context Stack** (top of main area) — selected items displayed as removable `ContextCard` chips. Each card shows the entity name, extension (or "Folder"), and a hover-reveal remove button. "Clear all" button in the header.
- **Prompt Input** (bottom) — multi-line textarea for user instructions
- **Action Row** — live character and `~token` estimates (approximated at 4 chars/token), plus a "Copy Prompt" button that turns green with a checkmark on success
- **Final prompt format:** assembled XML + `<user_query>user text</user_query>`
- `FileTreeNode.vue` updated — each row has a checkbox that appears on hover (or stays visible when checked). Checking adds/removes the item from the context stack immediately, triggering a re-assembly.
- `App.vue` updated — main area renders `<PromptBuilder>` when a project is active, placeholder otherwise

**Files introduced:**

| File | Description |
|---|---|
| [`src/main/prompt.ts`](src/main/prompt.ts) | XML assembler — recursive folder/file reading, binary detection, tag sanitization |
| [`src/renderer/src/features/prompt-builder/types.ts`](src/renderer/src/features/prompt-builder/types.ts) | `ContextEntry` interface |
| [`src/renderer/src/features/prompt-builder/stores/prompt.ts`](src/renderer/src/features/prompt-builder/stores/prompt.ts) | Pinia store — context list, assembly, metrics, clipboard |
| [`src/renderer/src/features/prompt-builder/components/PromptBuilder.vue`](src/renderer/src/features/prompt-builder/components/PromptBuilder.vue) | Main content area layout |
| [`src/renderer/src/features/prompt-builder/components/ContextStack.vue`](src/renderer/src/features/prompt-builder/components/ContextStack.vue) | Context card grid with clear-all |
| [`src/renderer/src/features/prompt-builder/components/ContextCard.vue`](src/renderer/src/features/prompt-builder/components/ContextCard.vue) | Individual removable file/folder chip |

**Files modified:**

| File | Change |
|---|---|
| [`src/main/ipc.ts`](src/main/ipc.ts) | Added `prompt:assemble` IPC handler |
| [`src/preload/index.ts`](src/preload/index.ts) | Exposed `assemblePrompt` on `window.api` |
| [`src/preload/index.d.ts`](src/preload/index.d.ts) | Added `SelectedEntry`, `AssembleResult`, `assemblePrompt` types |
| [`src/renderer/src/features/projects/components/FileTreeNode.vue`](src/renderer/src/features/projects/components/FileTreeNode.vue) | Added hover-reveal checkbox wired to prompt store |
| [`src/renderer/src/App.vue`](src/renderer/src/App.vue) | Main area conditionally renders `PromptBuilder` |

---
