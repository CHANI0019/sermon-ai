# DESIGN.md

> 프로젝트명: `[Project Name]`
> 버전: `v0.1.0`
> 최종 수정일: `YYYY-MM-DD`
> 작성자: `[Author]`

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [UI/UX 디자인](#2-uiux-디자인)
3. [소프트웨어 아키텍처](#3-소프트웨어-아키텍처)
4. [API 설계](#4-api-설계)
5. [데이터 모델](#5-데이터-모델)
6. [보안 설계](#6-보안-설계)
7. [성능 및 확장성](#7-성능-및-확장성)
8. [변경 이력](#8-변경-이력)

---

## 1. 프로젝트 개요

### 1.1 목적

> 이 시스템이 해결하려는 핵심 문제를 2~3문장으로 설명합니다.

### 1.2 범위

- **포함**: 
- **제외**: 

### 1.3 기술 스택

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| Frontend | React | 18.x | |
| Backend | Node.js / Express | 20.x | |
| Database | PostgreSQL | 16.x | |
| Infra | AWS / GCP / Azure | - | |
| CI/CD | GitHub Actions | - | |

### 1.4 핵심 설계 원칙

1. **[원칙 1]** — 설명
2. **[원칙 2]** — 설명
3. **[원칙 3]** — 설명

---

## 2. UI/UX 디자인

### 2.1 디자인 시스템

#### 컬러 팔레트

| 역할 | 토큰명 | HEX | 사용처 |
|------|--------|-----|--------|
| Primary | `color-primary` | `#0057FF` | 버튼, 링크, 강조 |
| Secondary | `color-secondary` | `#6C757D` | 보조 액션 |
| Success | `color-success` | `#28A745` | 완료/성공 상태 |
| Warning | `color-warning` | `#FFC107` | 경고 |
| Danger | `color-danger` | `#DC3545` | 오류, 삭제 |
| Background | `color-bg` | `#F8F9FA` | 페이지 배경 |
| Surface | `color-surface` | `#FFFFFF` | 카드, 모달 |
| Text | `color-text` | `#212529` | 본문 |
| Text Muted | `color-muted` | `#6C757D` | 보조 텍스트 |

#### 타이포그래피

| 단계 | 태그 | 크기 | 굵기 | 용도 |
|------|------|------|------|------|
| Heading 1 | `h1` | 32px / 2rem | 700 | 페이지 제목 |
| Heading 2 | `h2` | 24px / 1.5rem | 600 | 섹션 제목 |
| Heading 3 | `h3` | 20px / 1.25rem | 600 | 서브 섹션 |
| Body | `p` | 16px / 1rem | 400 | 본문 |
| Caption | `small` | 12px / 0.75rem | 400 | 보조 설명 |
| Label | `label` | 14px / 0.875rem | 500 | 폼 레이블 |

- **기본 폰트**: `Inter`, `Pretendard`, `sans-serif`
- **코드 폰트**: `JetBrains Mono`, `monospace`
- **줄 간격**: 1.6 (본문), 1.2 (제목)

#### 스페이싱 시스템

| 토큰 | 값 | 용도 |
|------|----|------|
| `space-xs` | 4px | 아이콘 간격 |
| `space-sm` | 8px | 인라인 요소 |
| `space-md` | 16px | 컴포넌트 내부 |
| `space-lg` | 24px | 섹션 간격 |
| `space-xl` | 40px | 페이지 레이아웃 |
| `space-2xl` | 64px | 랜딩 섹션 |

#### 컴포넌트 규칙

- **Border Radius**: `4px` (소), `8px` (중), `16px` (카드), `9999px` (pill)
- **Shadow**: `0 1px 3px rgba(0,0,0,0.12)` (기본), `0 4px 16px rgba(0,0,0,0.16)` (모달)
- **Transition**: `all 150ms ease-in-out`

---

### 2.2 레이아웃 구조

```
┌──────────────────────────────────────────┐
│              Header / Nav                │
├──────────┬───────────────────────────────┤
│          │                               │
│ Sidebar  │        Main Content           │
│ (240px)  │                               │
│          │                               │
├──────────┴───────────────────────────────┤
│                 Footer                   │
└──────────────────────────────────────────┘
```

- **Breakpoints**

| 이름 | 범위 | 레이아웃 |
|------|------|----------|
| Mobile | < 768px | 단일 컬럼, 사이드바 숨김 |
| Tablet | 768px – 1024px | 2컬럼, 사이드바 축소 |
| Desktop | > 1024px | 풀 레이아웃 |

---

### 2.3 핵심 화면 목록

| 화면 | 경로 | 설명 | 우선순위 |
|------|------|------|----------|
| 홈 | `/` | 메인 랜딩/대시보드 | P0 |
| 로그인 | `/login` | 인증 진입점 | P0 |
| 회원가입 | `/signup` | 신규 사용자 가입 | P0 |
| 대시보드 | `/dashboard` | 핵심 기능 허브 | P0 |
| 설정 | `/settings` | 사용자 설정 | P1 |
| 404 | `*` | 에러 페이지 | P1 |

---

### 2.4 사용자 플로우

#### 핵심 플로우: [기능명]

```
[진입점]
  │
  ▼
[단계 1: 설명]
  │
  ├── (성공) ──▶ [단계 2: 설명]
  │                   │
  │                   ▼
  │             [완료 화면]
  │
  └── (실패) ──▶ [오류 처리]
```

---

### 2.5 접근성 (a11y) 기준

- WCAG 2.1 AA 준수
- 색상 대비비: 텍스트 **4.5:1** 이상, 대형 텍스트 **3:1** 이상
- 모든 인터랙티브 요소에 `aria-label` 또는 시각적 텍스트 레이블 제공
- 키보드 탐색 지원 (Tab 순서, Focus indicator)
- 스크린 리더 호환 (`role`, `aria-*` 속성)

---

## 3. 소프트웨어 아키텍처

### 3.1 아키텍처 개요

> 사용하는 아키텍처 패턴을 명시합니다.
> 예: Monolith / Microservices / Serverless / Event-Driven / Layered

```
┌─────────────────────────────────────────────┐
│                  Client                     │
│         (Web Browser / Mobile App)          │
└──────────────┬──────────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────────┐
│              API Gateway / CDN              │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│  Service A  │  │  Service B  │
│  (Auth)     │  │  (Core)     │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                ▼
┌─────────────────────────────────────────────┐
│               Database Layer                │
│   PostgreSQL (Primary) + Redis (Cache)      │
└─────────────────────────────────────────────┘
```

---

### 3.2 계층 구조 (Layered Architecture)

```
src/
├── presentation/      # 컨트롤러, 라우터, DTO
├── application/       # 유스케이스, 서비스
├── domain/            # 엔티티, 도메인 로직, 인터페이스
└── infrastructure/    # DB, 외부 API, 캐시
```

| 계층 | 역할 | 의존 방향 |
|------|------|-----------|
| Presentation | HTTP 요청/응답 처리 | → Application |
| Application | 비즈니스 유스케이스 조율 | → Domain |
| Domain | 핵심 비즈니스 규칙 | (외부 의존 없음) |
| Infrastructure | DB, 메시지 큐, 외부 서비스 | → Domain (구현) |

---

### 3.3 주요 모듈

| 모듈 | 책임 | 주요 클래스/파일 |
|------|------|-----------------|
| Auth | 인증/인가 (JWT, OAuth) | `AuthService`, `JwtStrategy` |
| User | 사용자 관리 | `UserService`, `UserRepository` |
| [Feature] | [설명] | |

---

### 3.4 상태 관리 (Frontend)

> 예: Redux Toolkit / Zustand / Jotai / Context API

| 상태 범위 | 관리 방식 | 예시 |
|-----------|-----------|------|
| 전역 (Global) | Zustand store | 사용자 세션, 테마 |
| 서버 (Server) | React Query | API 응답 캐시 |
| 로컬 (Local) | useState | 폼 입력, 모달 |

---

### 3.5 외부 의존성

| 서비스 | 용도 | 대안 |
|--------|------|------|
| AWS S3 | 파일 스토리지 | GCS |
| SendGrid | 이메일 발송 | AWS SES |
| Stripe | 결제 처리 | - |
| [기타] | | |

---

## 4. API 설계

### 4.1 기본 규칙

- **스타일**: RESTful (또는 GraphQL / gRPC — 명시)
- **Base URL**: `https://api.example.com/v1`
- **인증**: Bearer Token (JWT)
- **콘텐츠 타입**: `application/json`
- **날짜 형식**: ISO 8601 (`2024-01-15T09:00:00Z`)
- **페이지네이션**: cursor-based / offset-based

---

### 4.2 공통 응답 형식

#### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "요청 값이 올바르지 않습니다.",
    "details": [
      { "field": "email", "message": "유효한 이메일 형식이 아닙니다." }
    ]
  }
}
```

#### HTTP 상태 코드 규칙

| 코드 | 의미 | 사용 시나리오 |
|------|------|---------------|
| 200 | OK | 조회/수정 성공 |
| 201 | Created | 리소스 생성 성공 |
| 204 | No Content | 삭제 성공 |
| 400 | Bad Request | 유효성 검증 실패 |
| 401 | Unauthorized | 인증 토큰 없음/만료 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복 리소스 |
| 422 | Unprocessable | 비즈니스 로직 오류 |
| 429 | Too Many Requests | Rate Limit 초과 |
| 500 | Internal Error | 서버 오류 |

---

### 4.3 엔드포인트 명세

#### 인증 (Auth)

| Method | Path | 설명 | 인증 필요 |
|--------|------|------|-----------|
| POST | `/auth/signup` | 회원가입 | ✗ |
| POST | `/auth/login` | 로그인 | ✗ |
| POST | `/auth/logout` | 로그아웃 | ✓ |
| POST | `/auth/refresh` | 토큰 갱신 | ✓ |
| POST | `/auth/forgot-password` | 비밀번호 찾기 | ✗ |

##### `POST /auth/login`

**Request**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response 200**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600
  }
}
```

---

#### 사용자 (User)

| Method | Path | 설명 | 인증 필요 |
|--------|------|------|-----------|
| GET | `/users/me` | 내 정보 조회 | ✓ |
| PATCH | `/users/me` | 내 정보 수정 | ✓ |
| DELETE | `/users/me` | 계정 삭제 | ✓ |
| GET | `/users/:id` | 특정 유저 조회 | ✓ |

---

#### [도메인명] ([Domain])

| Method | Path | 설명 | 인증 필요 |
|--------|------|------|-----------|
| GET | `/[resources]` | 목록 조회 | ✓ |
| POST | `/[resources]` | 생성 | ✓ |
| GET | `/[resources]/:id` | 단건 조회 | ✓ |
| PATCH | `/[resources]/:id` | 수정 | ✓ |
| DELETE | `/[resources]/:id` | 삭제 | ✓ |

---

### 4.4 Rate Limiting

| 대상 | 제한 | 윈도우 |
|------|------|--------|
| 공개 엔드포인트 | 60 req | 1분 |
| 인증된 사용자 | 300 req | 1분 |
| 로그인 시도 | 10 req | 1시간 |

---

## 5. 데이터 모델

### 5.1 ERD 요약

```
users
 │
 ├──< [resources] (1:N)
 │
 └──< [resources] (M:N) >── [join_table]
```

### 5.2 테이블 명세

#### `users`

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | UUID | PK, NOT NULL | 고유 식별자 |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt 해시 |
| `name` | VARCHAR(100) | NOT NULL | 표시 이름 |
| `role` | ENUM | NOT NULL, DEFAULT 'user' | user / admin |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | 생성일 |
| `updated_at` | TIMESTAMPTZ | NOT NULL | 수정일 |
| `deleted_at` | TIMESTAMPTZ | NULLABLE | soft delete |

#### `[table_name]`

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `id` | UUID | PK | |
| `user_id` | UUID | FK → users.id | |
| `...` | | | |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

### 5.3 인덱스 전략

| 테이블 | 인덱스 컬럼 | 타입 | 이유 |
|--------|-------------|------|------|
| users | `email` | UNIQUE | 로그인 조회 |
| [table] | `user_id` | B-Tree | FK 조회 성능 |
| [table] | `created_at` | B-Tree | 시간순 정렬 |

---

## 6. 보안 설계

### 6.1 인증/인가

- **인증**: JWT (Access Token 15분 + Refresh Token 7일)
- **비밀번호**: bcrypt, cost factor 12
- **OAuth 2.0**: Google, GitHub (선택)
- **인가**: RBAC (Role-Based Access Control)

| 역할 | 권한 |
|------|------|
| `guest` | 공개 리소스 읽기 |
| `user` | 본인 리소스 CRUD |
| `admin` | 전체 리소스 관리 |

### 6.2 보안 체크리스트

- [ ] HTTPS 강제 적용 (HSTS)
- [ ] CORS 정책 설정 (허용 도메인 명시)
- [ ] SQL Injection 방지 (Parameterized Query / ORM)
- [ ] XSS 방지 (CSP 헤더, 입력 이스케이프)
- [ ] CSRF 방지 (SameSite 쿠키, CSRF 토큰)
- [ ] 민감 정보 환경변수 관리 (.env, Secret Manager)
- [ ] Rate Limiting 적용
- [ ] 로그에 PII 포함 금지
- [ ] 의존성 취약점 정기 스캔 (npm audit / Snyk)

---

## 7. 성능 및 확장성

### 7.1 성능 목표

| 지표 | 목표값 | 측정 방법 |
|------|--------|-----------|
| API 응답 시간 (P99) | < 300ms | APM (Datadog) |
| 페이지 로드 (LCP) | < 2.5s | Lighthouse |
| 동시 사용자 | 1,000 명 | 부하 테스트 |
| 가용성 (SLA) | 99.9% | Uptime 모니터 |

### 7.2 캐싱 전략

| 레이어 | 도구 | TTL | 대상 |
|--------|------|-----|------|
| CDN | CloudFront | 1일 | 정적 에셋 |
| API 캐시 | Redis | 5분 | 목록 조회 |
| DB 쿼리 | Redis | 1분 | 집계 쿼리 |

### 7.3 확장 전략

- **수평 확장**: 무상태 API 서버 → 로드밸런서 뒤에서 스케일 아웃
- **DB**: Read Replica 분리, Connection Pooling (PgBouncer)
- **비동기 처리**: 이메일 발송, 대용량 작업 → 메시지 큐 (BullMQ / SQS)

---

## 8. 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v0.1.0 | YYYY-MM-DD | [작성자] | 최초 작성 |
| v0.2.0 | YYYY-MM-DD | [작성자] | API 섹션 보완 |

---

> **문서 관리 원칙**
> - 설계 변경 시 이 문서를 함께 업데이트합니다.
> - PR에 설계 문서 링크를 첨부합니다.
> - 결정의 배경(ADR)은 `/docs/adr/` 디렉토리에 별도 관리합니다.
