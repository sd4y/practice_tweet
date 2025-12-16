# Project Architecture Reference

> **Version**: 2.0 (Deep Dive)
> **Applicability**: Global (apps/web, apps/api, packages)

## 1. High-Level Overview
This project is a **Full-Stack Social Media Application** (Twitter Clone) orchestrated as a **Turborepo Monorepo**.
It strictly separates concerns between the Client (Frontend) and Server (Backend) while sharing core database logic via a designated package.

## 2. Technology Stack & Versions

| Component | Technology | Version / Note |
| :--- | :--- | :--- |
| **Monorepo** | Turborepo | Managed via `pnpm-workspace.yaml` |
| **Package Manager** | pnpm | Enforced for efficiency and strict dependency management |
| **Frontend** | Next.js | App Router (`/app` dir), React Server Components (RSC) & Client Components |
| **Backend** | NestJS | 9.x+ with Express adapter |
| **Database** | PostgreSQL | Relational data model |
| **ORM** | Prisma | `@repo/database` package containing `schema.prisma` |
| **Styling** | CSS Modules | Vanilla CSS scoped via `*.module.css` |
| **Icons** | Lucide React | Unified icon set |

## 3. Directory Structure & Responsibilities

### 3.1 Root Directory
*   `package.json`: Root scripts for Turbo (e.g., `pnpm dev` triggers dev scripts in apps).
*   `pnpm-workspace.yaml`: Defines workspace members (`apps/*`, `packages/*`).
*   `.turbo/`: Turborepo cache artifacts.

### 3.2 `apps/web` (Frontend)
The Next.js consumer application.
*   **`app/`**: Route definitions.
    *   `page.tsx`: **Landing Page** (Redirects to `/main` if authed).
    *   `main/page.tsx`: **Main Feed** (Authenticated view).
    *   `following/page.tsx`: **Following Feed**.
    *   `layout.tsx`: Global layout (providers, fonts).
*   **`components/`**: Reusable UI blocks.
    *   `Sidebar.tsx`: Main navigation.
    *   `Feed.tsx`: Infinite scroll container for Tweets.
    *   `Tweet.tsx`: Atomic unit of content display.
*   **`lib/`**: Utilities.
    *   `api.ts`: **Singleton Axios Instance**. All HTTP requests MUST use this instance (handles base URL).

### 3.3 `apps/api` (Backend)
The NestJS server application.
*   **`src/`**: Source root.
    *   `main.ts`: Entry point. Configures CORS, Port (default: 3001), Global Pipes.
    *   **Modules**: Organized by domain (Feature Modules).
        *   `auth/`: JWT strategies, Login/Signup logic.
        *   `tweets/`: Tweet CRUD, Likes management.
        *   `users/`: User profiles.
        *   `prisma/`: Global module wrapping `@repo/database`.
*   **`uploads/`**: Local storage for uploaded headers/avatars (served as static assets).

### 3.4 `packages/database`
The Single Source of Truth for Data.
*   `prisma/schema.prisma`: Defines the exact DB structure.
*   **Exports**: `PrismaClient` instance used by `apps/api`.
*   **Responsibility**: Only strict DB logic. No business logic.

## 4. Request Lifecycle

### Example: creating a Tweet
1.  **User Action**: User clicks "Post" in `Feed.tsx`.
2.  **Client Logic**:
    *   `Feed.tsx` collects `content` and optional `image` URL.
    *   Calls `api.post('/tweets', payload)`.
3.  **API Routing**:
    *   `tweets.controller.ts` receives `POST /`.
    *   **Guard**: `JwtAuthGuard` verifies the Bearer token.
    *   **Decorator**: `@User()` extracts `userId` from the token.
4.  **Service Layer**:
    *   `tweets.service.ts` constructs the Prisma query using `Prisma.TweetCreateInput`.
    *   Injects `author: { connect: { id: userId } }`.
5.  **Database**:
    *   Prisma sends SQL to PostgreSQL.
    *   Records created in `Tweet` table.
6.  **Response**:
    *   JSON object of the created Tweet returned to Client.
    *   Client updates local state (`setTweets`) to reflect change immediately (or re-fetches).

## 5. Deployment & Environment
*   **Dev Mode**: `pnpm dev` runs all apps in parallel using Turbo.
*   **Environment Variables**:
    *   `DATABASE_URL`: Required by `@repo/database`.
    *   `JWT_SECRET`: Required by `apps/api`.
