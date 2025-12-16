# New Project UI Guide

이 문서는 프로젝트의 UI 구성 요소와 해당 코드가 위치한 파일들을 연결하여, 수정이 필요할 때 어떤 파일을 찾아야 하는지 안내합니다.

## 📂 Frontend (`apps/web/app/`)

사용자가 화면에서 보는 모든 UI 요소는 이곳에 있습니다.

### 🏗️ 핵심 구조 (Core Structure)

| 파일명 | 역할 및 설명 |
|---|---|
| [`layout.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/layout.tsx) | **앱의 뼈대**. 전역 폰트(GeistSans/Mono) 설정, 메타데이터(Title, Description), HTML/BODY 태그 구조 정의. |
| [`page.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/page.tsx) | **랜딩 페이지 (Landing Page)**. 비로그인 사용자에게 보이는 첫 화면. 로그인 시 `/main`으로 리다이렉트. |
| [`main/page.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/main/page.tsx) | **메인 피드 (For You)**. 로그인 후 진입하는 기본 화면. 모든 트윗 표시. |
| [`following/page.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/following/page.tsx) | **팔로잉 피드**. 내가 팔로우한 사용자의 트윗만 표시. |
| [`globals.css`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/globals.css) | **전역 스타일**. 앱 전체에 적용되는 CSS 변수와 리셋 스타일 정의. |

### 🧩 컴포넌트 (Components)

UI를 구성하는 각 부분입니다. 화면에서 수정하고 싶은 부분을 찾으세요.

#### 1. 로그인/회원가입 (Authentication)
| 파일명 | 역할 및 설명 |
|---|---|
| [`components/LandingPage.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/LandingPage.tsx) | **랜딩 페이지 컴포넌트**. `page.tsx`에서 사용됨. 로그인/회원가입으로 이동하는 버튼 포함. |
| [`components/LoginModal.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/LoginModal.tsx) | **로그인 팝업**. 이메일/비밀번호 입력 폼. |
| [`components/SignupModal.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/SignupModal.tsx) | **회원가입 팝업**. 계정 생성 폼. |
| [`components/Modal.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Modal.tsx) | **모달 공통 래퍼**. 로그인/회원가입 모달의 껍데기(배경, 닫기 버튼 등) 역할. |

#### 2. 메인 앱 레이아웃 (Main Application)
로그인 후 보이는 화면의 전체 레이아웃입니다. 3단 구조(왼쪽 사이드바 - 중앙 피드 - 오른쪽 섹션)로 되어 있습니다.

| 파일명 | 역할 및 설명 |
|---|---|
| [`components/MainLayout.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/MainLayout.tsx) | **전체 레이아웃 컨테이너**. 사이드바(Sidebar), 메인 콘텐츠(Feed), 오른쪽 섹션(RightSection)을 배치하고 현재 사용자 정보를 불러옴. |
| [`components/Sidebar.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Sidebar.tsx) | **왼쪽 메뉴바**. 로고, 네비게이션 메뉴(Home, Explore 등), 게시글 작성 버튼, 하단 사용자 프로필 버튼(로그아웃 메뉴 포함). |
| [`components/RightSection.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/RightSection.tsx) | **오른쪽 사이드 패널**. 검색창, 프리미엄 구독 카드, 실시간 트렌드("What's happening"), 팔로우 추천 목록("Who to follow"). |

#### 3. 피드 및 게시글 (Feed & Posts)
중앙 화면에 표시되는 콘텐츠입니다.

| 파일명 | 역할 및 설명 |
|---|---|
| [`components/Feed.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Feed.tsx) | **메인 타임라인**. 상단 탭(For you/Following), **새 게시글 작성 입력창**, 그리고 게시글 목록()을 관리하고 표시. |
| [`components/Tweet.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Tweet.tsx) | **개별 게시글 카드**. 작성자 정보, 게시글 내용(텍스트/이미지), 하단 액션 버튼(답글, 리트윗, 좋아요, 조회수) 표시. |

### 🛠️ 유틸리티 (Utilities)
| 파일명 | 역할 및 설명 |
|---|---|
| [`lib/api.ts`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/lib/api.ts) | **API 통신 모듈**. 백엔드 서버(`http://127.0.0.1:3001`)와 통신하는 Axios 설정. 인증 토큰 자동 첨부 및 401 에러(로그아웃) 처리. |

---

## 📂 Backend (`apps/api/src/`)

Frontend의 요청을 처리하는 서버 코드입니다. 데이터베이스 작업이 필요할 때 수정합니다.

| 모듈(폴더) | 주요 파일 | 역할 및 설명 |
|---|---|---|
| **App** | `app.module.ts` | 앱의 최상위 모듈. 모든 하위 모듈 결합. |
| | `main.ts` | 서버 실행 진입점. 포트 설정(3001) 및 미들웨어(CORS) 설정. |
| **Auth** | `auth/auth.controller.ts` | **인증 API**. 로그인(`/auth/login`), 회원가입(`/auth/signup`), 내 정보(`/auth/profile`) 엔드포인트 처리. |
| | `auth/auth.service.ts` | 비밀번호 해싱, JWT 토큰 발급 등 실제 인증 비즈니스 로직. |
| | `auth/jwt.strategy.ts` | API 요청 시 토큰 유효성 검증 로직. |
| **Tweets** | `tweets/tweets.controller.ts` | **게시글 API**. 게시글 작성, 조회, 삭제 엔드포인트. |
| | `tweets/tweets.service.ts` | 게시글 DB 저장/조회 로직. |
| **Users** | `users/users.service.ts` | 사용자 정보 조회 및 관리 로직. |
| **Upload** | `upload/upload.controller.ts` | **파일 업로드 API**. 이미지 업로드 요청 처리. |
| **Prisma** | `prisma/` | 데이터베이스 연결 및 ORM 설정. |

---

### 💡 수정 시나리오별 가이드

1. **"메인 화면의 파란색 'Post' 버튼 색상을 바꾸고 싶어요"**
   - 👉 [`apps/web/app/components/Sidebar.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Sidebar.tsx) (또는 관련 CSS 모듈)

2. **"게시글 작성할 때 이미지 미리보기 닫기(X) 버튼을 키우고 싶어요"**
   - 👉 [`apps/web/app/components/Feed.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/Feed.tsx) (작성영역은 Feed 컴포넌트 상단에 있습니다)

3. **"오른쪽 'Who to follow' 목록을 안 보이게 하거나 내용을 바꾸고 싶어요"**
   - 👉 [`apps/web/app/components/RightSection.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/RightSection.tsx)

4. **"로그인 입력창에 '아이디 기억하기' 체크박스를 넣고 싶어요"**
   - 👉 [`apps/web/app/components/LoginModal.tsx`](file:///c:/0_Projects/00_Jungle/02_실력다지기/new_test/apps/web/app/components/LoginModal.tsx)
