# 프로젝트 복구 매뉴얼 (Recovery Manual)

이 문서는 프로젝트를 완전히 새로 내려받거나(`git pull`), 과거 시점으로 되돌리고 싶을 때 **현재의 정상 작동 상태**로 복구하기 위한 가이드입니다.

## 1. 필수 전제 조건
*   **PostgreSQL**이 로컬 컴퓨터에 설치되어 있어야 합니다.
*   **Node.js** (v18 이상) 및 **pnpm**이 설치되어 있어야 합니다.

## 2. 데이터베이스 설정 (Database Setup)
이 프로젝트는 **로컬 PostgreSQL**의 `twitter_clone` 데이터베이스를 사용합니다.

### 접속 정보
*   **Host**: `localhost`
*   **Port**: `5432`
*   **User**: `postgres`
*   **Password**: `jg1130649`
*   **Database**: `twitter_clone`

### 데이터베이스가 없다면?
만약 `twitter_clone` 데이터베이스가 없다면 다음 명령어로 생성할 수 있습니다.
(이미 존재한다면 생략 가능)

```bash
# pnpm dev 실행 전, DB 스키마 밀어넣기
pnpm db:push
```

## 3. 환경 변수 복구 (.env Repair)
`.env` 파일은 보안상 Git에 저장되지 않습니다. 프로젝트를 다시 받았을 때 아래 내용을 복사해서 파일을 직접 만들어주세요.

### 3-1. `apps/api/.env` 생성
경로: `apps/api/.env`

```env
DATABASE_URL="postgresql://postgres:jg1130649@localhost:5432/twitter_clone?schema=public"
JWT_SECRET="super-secret-jwt-key-change-me"
```

### 3-2. `packages/database/.env` 생성
경로: `packages/database/.env`

```env
DATABASE_URL="postgresql://postgres:jg1130649@localhost:5432/twitter_clone?schema=public"
```

> **팁**: 만약 윈도우 메모장 등으로 만들다가 인코딩 문제가 생긴다면, 루트 디렉토리에 포함된 `fix_env.js`를 실행하세요.
> ```bash
> node fix_env.js
> ```

## 4. 실행 방법
1.  패키지 설치: `pnpm install`
2.  환경 변수 확인: 위 3번 단계 참조
3.  DB 동기화: `pnpm db:push`
4.  서버 실행: `pnpm dev`
