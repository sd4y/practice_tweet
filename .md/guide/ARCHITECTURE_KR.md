# 프로젝트 아키텍처 레퍼런스

> **버전**: 2.0 (심층 분석)
> **적용 범위**: 전체 (apps/web, apps/api, packages)

## 1. 개요 (Overview)
이 프로젝트는 **Turborepo 모노레포**로 구성된 **풀스택 소셜 미디어 애플리케이션** (트위터 클론)입니다.
클라이언트(Frontend)와 서버(Backend)의 역할을 엄격히 분리하며, 데이터베이스 로직은 공유 패키지를 통해 관리합니다.

## 2. 기술 스택 및 버전 (Technology Stack)

| 컴포넌트 | 기술 | 버전 / 비고 |
| :--- | :--- | :--- |
| **모노레포** | Turborepo | `pnpm-workspace.yaml`로 관리 |
| **패키지 매니저** | pnpm | 효율성 및 엄격한 의존성 관리를 위해 강제됨 |
| **프론트엔드** | Next.js | App Router (`/app`), RSC 및 클라이언트 컴포넌트 사용 |
| **백엔드** | NestJS | 9.x+ (Express 어댑터 사용) |
| **데이터베이스** | PostgreSQL | 관계형 데이터 모델 |
| **ORM** | Prisma | `@repo/database` 패키지에 정의됨 (`schema.prisma`) |
| **스타일링** | CSS Modules | `*.module.css`를 통한 스코프(Scope) 스타일링 |
| **아이콘** | Lucide React | 통일된 아이콘 시스템 |

## 3. 디렉토리 구조 및 역할

### 3.1 루트 디렉토리 (Root)
*   `package.json`: Turbo 루트 스크립트 정의 (예: `pnpm dev` 실행 시 하위 앱 병렬 실행).
*   `pnpm-workspace.yaml`: 워크스페이스 멤버 정의 (`apps/*`, `packages/*`).
*   `.turbo/`: 터보레포 캐시 아티팩트.

### 3.2 `apps/web` (Frontend)
Next.js 기반의 사용자 애플리케이션입니다.
*   **`app/`**: 라우트 정의.
    *   `page.tsx`: **랜딩 페이지** (로그인 시 `/main`으로 리다이렉트).
    *   `main/page.tsx`: **메인 피드** (인증된 뷰).
    *   `following/page.tsx`: **팔로잉 피드**.
    *   `layout.tsx`: 전역 레이아웃 (Provider, 폰트 설정).
*   **`components/`**: 재사용 가능한 UI 블록.
    *   `Sidebar.tsx`: 메인 네비게이션.
    *   `Feed.tsx`: 트윗 무한 스크롤 컨테이너.
    *   `Tweet.tsx`: 콘텐츠 표시의 최소 단위.
*   **`lib/`**: 유틸리티.
    *   `api.ts`: **싱글톤 Axios 인스턴스**. 모든 HTTP 요청은 반드시 이 인스턴스를 사용해야 합니다 (Base URL 처리).

### 3.3 `apps/api` (Backend)
NestJS 서버 애플리케이션입니다.
*   **`src/`**: 소스 루트.
    *   `main.ts`: 엔트리 포인트. CORS, 포트(기본 3001), 전역 파이프 설정.
    *   **Modules**: 도메인별 기능 모듈.
        *   `auth/`: JWT 전략, 로그인/회원가입 로직.
        *   `tweets/`: 트윗 CRUD, 좋아요 관리.
        *   `users/`: 사용자 프로필.
        *   `prisma/`: `@repo/database`를 래핑하는 전역 모듈.
*   **`uploads/`**: 업로드된 헤더/아바타 이미지 저장소 (정적 파일로 서빙).

### 3.4 `packages/database`
데이터의 단일 진실 공급원(Single Source of Truth)입니다.
*   `prisma/schema.prisma`: 정확한 DB 구조 정의.
*   **Exports**: `apps/api`에서 사용하는 `PrismaClient` 인스턴스.
*   **역할**: 오직 DB 로직만 담당. 비즈니스 로직 포함 금지.

## 4. 요청 수명 주기 (Request Lifecycle)

### 예시: 트윗 생성 (Create Tweet)
1.  **사용자 행동**: `Feed.tsx`에서 "Post" 버튼 클릭.
2.  **클라이언트 로직**:
    *   `Feed.tsx`가 `content`와 선택적 `image` URL을 수집.
    *   `api.post('/tweets', payload)` 호출.
3.  **API 라우팅**:
    *   `tweets.controller.ts`가 `POST /` 요청 수신.
    *   **Guard**: `JwtAuthGuard`가 Bearer 토큰 검증.
    *   **Decorator**: `@User()`가 토큰에서 `userId` 추출.
4.  **서비스 계층**:
    *   `tweets.service.ts`가 `Prisma.TweetCreateInput`을 사용하여 쿼리 구성.
    *   `author: { connect: { id: userId } }` 주입.
5.  **데이터베이스**:
    *   Prisma가 PostgreSQL로 SQL 전송.
    *   `Tweet` 테이블에 레코드 생성.
6.  **응답**:
    *   생성된 트윗의 JSON 객체를 클라이언트로 반환.
    *   클라이언트는 로컬 상태(`setTweets`)를 즉시 업데이트하여 반영 (또는 재요청).

## 5. 배포 및 환경 (Deployment)
*   **개발 모드**: `pnpm dev` (모든 앱 병렬 실행).
*   **환경 변수**:
    *   `DATABASE_URL`: `@repo/database` 필수.
    *   `JWT_SECRET`: `apps/api` 필수.
