# Coding Conventions & Project Standards

> **Version**: 2.0 (Strict)
> **Enforcement**: Mandatory for all Agents and Developers.

## 1. Source File Basics

### 1.1 File Structure
**React Components (`.tsx`)**:
1.  **Imports**:
    *   External Libraries (React, Next.js, 3rd party).
    *   Local Components (Relative imports).
    *   Styles (`*.module.css`).
2.  **Interfaces**: Define `Props` immediately before the component.
3.  **Component Definition**: `export function ComponentName(...)`.
4.  **Exports**: Named exports favored over Default exports for better refactoring support.

**NestJS Services/Controllers (`.ts`)**:
1.  **Imports**: NestJS common -> App Modules -> Local Utils.
2.  **Class Definition**: `export class Name { ... }`.
3.  **Dependency Injection**: `constructor(private readonly name: Type) {}`.

### 1.2 Formatting
*   **Indentation**: 2 Spaces.
*   **Semicolons**: Always used.
*   **Quotes**: Single quotes `'` preferred over double quotes `"`, except in JSX attributes.
*   **Trailing Commas**: ES5 compatible (objects, arrays).

## 2. Naming Conventions (Strict)

| Type | Case | Example | Rule |
| :--- | :--- | :--- | :--- |
| **Directories** | `kebab-case` | `user-profile`, `auth` | Lowercase, hyphen-separated. |
| **Files (React)** | `PascalCase` | `Tweet.tsx`, `Sidebar.tsx` | Matches component name. |
| **Files (Nest)** | `kebab-case` | `tweets.service.ts` | `[domain].[type].ts` pattern. |
| **Classes** | `PascalCase` | `TweetsController` | Noun phrase. |
| **Interfaces** | `PascalCase` | `TweetProps`, `UserData` | Do **NOT** use `I` prefix (e.g., `ITweet` is forbidden). |
| **Variables** | `camelCase` | `isLiked`, `fetchCount` | Descriptive, no single-letter names (`x`, `i` allowed only in short loops). |
| **Constants** | `UPPER_SNAKE` | `MAX_UPLOAD_SIZE` | Only for global/module-level constants. |

## 3. Programming Practices

### 3.1 React / Frontend
*   **Functional Components Only**: Class components are forbidden.
*   **Hooks**:
    *   Must start with `use`.
    *   Complex logic (API calls, huge state reduction) should be extracted to custom hooks (`useAuth`, `useTweetActions`).
*   **CSS Modules**:
    *   **Filename**: `Component.module.css`.
    *   **Usage**: `className={styles.container}`.
    *   **Forbidden**: Inline styles (except for dynamic values like coordinates), Global CSS (except `globals.css` reset).
*   **Assets**: Images/Fonts go in absolute static paths if public, or imported if part of the bundle.

### 3.2 NestJS / Backend
*   **Controller Responsibility**:
    *   Receiving HTTP requests.
    *   Extracting params/body.
    *   Calling Service.
    *   **Forbidden**: Business logic, Database calls directly in Controller.
*   **Service Responsibility**:
    *   Database interaction (via Prisma).
    *   Data manipulation.
    *   Throwing `HttpException` (e.g., `NotFoundException`).
*   **DTOs**:
    *   Use `Prisma` generated types for complex DB shapes (`Prisma.UserCreateInput`).
    *   Use inline interfaces for simple request bodies to avoid one-off file proliferation in prototype phase.

### 3.3 Database
*   **Schema Modifications**:
    *   **Forbidden**: modifying `migrations` folder manually.
    *   **Required**: Edit `schema.prisma` -> `pnpm --filter @repo/database db:push`.
*   **Foreign Keys**: Explicitly define relation fields (shadow fields like `authorId`).

## 4. Error Handling
*   **Frontend**:
    *   Use `try/catch` around `await api.*`.
    *   Log errors to console: `console.error('Context:', error)`.
    *   Show user feedback (alert or toast) for critical failures.
*   **Backend**:
    *   Allow NestJS Global Exception Filter to handle standard errors.
    *   Throw specific exceptions: `throw new UnauthorizedException('Reason')`.

## 5. Commenting (Javadoc)
*   **Public Methods**: Document complex public methods in Services.
*   **Props**: Comment on vague prop names in Interfaces.
*   **Logic**: "Why", not "What". (e.g., "Optimistic update to ensure UI feels fast" is good. "Set state to true" is bad).
