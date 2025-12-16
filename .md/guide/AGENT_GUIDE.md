# Agent Operation Protocols & Workflows

> **Version**: 2.0 (Merge-Safe)
> **Target Audience**: Automated Agents & AI Assistants
> **Goal**: Zero-conflict integration across 100+ concurrent agent sessions.

## 1. The Golden Rules (Read Before Acting)

### Rule 1: "Read First, Write Second"
Before creating a function, file, or style, you **MUST** search the codebase to see if it already exists.
*   *Example*: Do not create `formatDate` in `utils.ts` if `lib/date.ts` already has it.
*   *Tool*: Use `grep_search` or `find_by_name`.

### Rule 2: "Atomic Scope"
Touch **ONLY** the files strictly necessary for your task.
*   Do not reformat unrelated files (prettier/lint) as this causes merge conflicts for other agents.
*   Do not upgrade dependencies unless explicitly tasked.

### Rule 3: "Preserve Architecture"
Respect the boundaries defined in `ARCHITECTURE.md`.
*   **Frontend Agents**: Never write directly to the DB. Use the API.
*   **Backend Agents**: Never put business logic in Controllers. Use Services.

## 2. Standardized Workflows

### Protocol A: Adding a New Page (Frontend)
1.  **Check Route Availability**: Verify `app/[route]/page.tsx` doesn't exist.
2.  **Create Directory**: `apps/web/app/[route]`.
3.  **Create Page**: `page.tsx` (Use `export default function Page()`).
4.  **Create Styles**: `page.module.css` (if specific styling needed).
5.  **Link**: Add entry to `Sidebar.tsx` ONLY if it's a top-level nav item.

### Protocol B: Adding a Backend Feature
1.  **Schema Check**: Does `schema.prisma` support this data?
    *   *If No*: Update Schema -> `db:push` -> Restart Server.
2.  **Module Check**: Does a domain module exist? (e.g., `tweets/`).
    *   *If Yes*: Add methods to existing Controller/Service.
    *   *If No*: Create new Module -> Register in `app.module.ts`.

### Protocol C: Modifying Shared Components (High Risk)
*   **Target**: `Tweet.tsx`, `Sidebar.tsx`, `Feed.tsx`.
*   **Risk**: High probability of conflict.
*   **Action**:
    1.  Read the **entire file** content first to ensure you have the latest version.
    2.  Use `replace_file_content` with **precise** context (at least 3 unique lines of context).
    3.  If logically completely new, consider creating a *new* component and importing it, rather than bloating the existing one.

## 3. Conflict Avoidance Strategy

### Naming Collisions
*   **CSS Classes**: Always use **CamelCase** in `module.css` to differentiate from library classes.
*   **Test Files**: Always suffix with `.spec.ts` or `.test.tsx`.

### State Management
*   **Global State**: Do not introduce Redux/Zustand without explicit tasking. Use `useState` + Prop Drilling (for 1-2 levels) or Context (if strictly needed).
*   **Server State**: Prefer re-fetching data via API over complex client-side caching mechanisms unless performance is critical.

## 4. Verification Checklist (Before "Done")
1.  **Build Check**: Does `pnpm dev` still run without crashing?
2.  **Type Check**: Are there new TypeScript errors? (No `any` unless absolutely unavoidable).
3.  **Lint Check**: Did you introduce unused variables?
4.  **Self-Correction**: If you edited a file and it broke the build, revert immediately and analyze why.
