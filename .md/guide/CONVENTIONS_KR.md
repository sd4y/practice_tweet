# 코딩 컨벤션 및 프로젝트 표준 (Coding Conventions)

> **버전**: 2.0 (엄격함)
> **적용 대상**: 모든 에이전트 및 개발자 (필수 준수)

## 1. 소스 파일 기본 (Source File Basics)

### 1.1 파일 구조 (File Structure)
**React 컴포넌트 (`.tsx`)**:
1.  **Imports**:
    *   외부 라이브러리 (React, Next.js, 3rd party).
    *   로컬 컴포넌트 (상대 경로).
    *   스타일 (`*.module.css`).
2.  **인터페이스**: 컴포넌트 바로 위에 `Props` 정의.
3.  **컴포넌트 정의**: `export function ComponentName(...)`.
4.  **Exports**: 리팩토링 용이성을 위해 Default export보다 Named export를 선호.

**NestJS 서비스/컨트롤러 (`.ts`)**:
1.  **Imports**: NestJS 공통 -> 앱 모듈 -> 로컬 유틸리티.
2.  **클래스 정의**: `export class Name { ... }`.
3.  **의존성 주입**: `constructor(private readonly name: Type) {}`.

### 1.2 포맷팅 (Formatting)
*   **들여쓰기**: 2 Spaces.
*   **세미콜론**: 항상 사용.
*   **따옴표**: JSX 속성을 제외하고는 작은따옴표 `'` 사용 권장.
*   **후행 콤마 (Trailing Commas)**: ES5 호환 (객체, 배열 등).

## 2. 네이밍 규칙 (Naming Conventions - 엄격)

| 유형 | 표기법 | 예시 | 규칙 |
| :--- | :--- | :--- | :--- |
| **디렉토리** | `kebab-case` | `user-profile`, `auth` | 소문자, 하이픈 분리. |
| **파일 (React)** | `PascalCase` | `Tweet.tsx`, `Sidebar.tsx` | 컴포넌트 이름과 일치. |
| **파일 (Nest)** | `kebab-case` | `tweets.service.ts` | `[도메인].[타입].ts` 패턴. |
| **클래스** | `PascalCase` | `TweetsController` | 명사구 사용. |
| **인터페이스** | `PascalCase` | `TweetProps`, `UserData` | `I` 접두사 사용 **금지** (예: `ITweet` 금지). |
| **변수** | `camelCase` | `isLiked`, `fetchCount` | 서술적 이름 사용. 단일 문자(`x`, `i`)는 짧은 루프에서만 허용. |
| **상수** | `UPPER_SNAKE` | `MAX_UPLOAD_SIZE` | 전역/모듈 레벨 상수에만 사용. |

## 3. 프로그래밍 관행 (Programming Practices)

### 3.1 React / Frontend
*   **함수형 컴포넌트만 사용**: 클래스 컴포넌트 금지.
*   **Hooks**:
    *   반드시 `use`로 시작해야 함.
    *   복잡한 로직(API 호출, 거대 상태 관리)은 커스텀 훅(`useAuth` 등)으로 분리.
*   **CSS Modules**:
    *   **파일명**: `Component.module.css`.
    *   **사용법**: `className={styles.container}`.
    *   **금지**: 인라인 스타일(동적 좌표 제외), 전역 CSS (`globals.css` 리셋 제외).
*   **에셋**: 이미지는 번들에 포함(import)하거나, 공개 파일의 경우 절대 경로 사용.

### 3.2 NestJS / Backend
*   **컨트롤러 책임**:
    *   HTTP 요청 수신.
    *   파라미터/바디 추출.
    *   서비스 호출.
    *   **금지**: 비즈니스 로직 구현, 데이터베이스 직접 호출.
*   **서비스 책임**:
    *   데이터베이스 상호작용 (Prisma).
    *   데이터 가공.
    *   예외 발생 (`NotFoundException` 등).
*   **DTO**:
    *   복잡한 DB 형태는 `Prisma` 생성 타입(`Prisma.UserCreateInput`) 사용.
    *   간단한 요청 바디는 파일 증식을 막기 위해 인라인 인터페이스 사용 (프로토타입 단계).

### 3.3 데이터베이스
*   **스키마 수정**:
    *   **금지**: `migrations` 폴더 수동 수정.
    *   **필수**: `schema.prisma` 편집 -> `pnpm --filter @repo/database db:push` 실행.
*   **외래 키**: 관계 필드와 Shadow 필드(`authorId` 등)를 명시적으로 정의.

## 4. 에러 처리 (Error Handling)
*   **Frontend**:
    *   `await api.*` 호출 시 `try/catch` 필수 사용.
    *   콘솔 로그: `console.error('Context:', error)`.
    *   치명적 오류 시 사용자 피드백(alert 등) 제공.
*   **Backend**:
    *   NestJS 전역 예외 필터 활용.
    *   구체적인 예외 throw: `throw new UnauthorizedException('Reason')`.

## 5. 주석 (Commenting)
*   **공용 메서드**: 서비스의 복잡한 공용 메서드에는 설명 작성.
*   **Props**: 인터페이스에서 모호한 속성 이름에 주석 작성.
*   **로직**: "무엇을"이 아니라 "**왜**"를 설명하세요. (예: "UI 반응 속도를 위해 낙관적 업데이트 수행"은 좋음. "상태를 true로 변경"은 나쁨).
