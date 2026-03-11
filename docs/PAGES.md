# SAL Lab — 페이지별 상세 기획

## 공통 레이아웃

```
┌─────────────────────────────────────┐
│ TopBar (28px, navy)                 │
├─────────────────────────────────────┤
│ Nav (60px, SAL 로고 + 메뉴)          │
├─────────────────────────────────────┤
│                                     │
│ Page Content                        │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

---

## 1. Homepage (`/`)

### 구조
- Hero: 타이틀 "Soft A-Life Laboratory" + 설명 + SAL 로고
- 모집 배너: 대학원생 모집 안내 (선택적 표시)
- 콘텐츠 그리드:
  - 좌: 최근 세미나 3건 (Content Collections에서 최신 3개)
  - 우상: 교수 프로필 카드 (간략)
  - 우하: 최근 공지 3건
- 연구 분야 카드 3개
- 멤버 미리보기 4명

### 데이터
- 최근 세미나: `getCollection('seminars')` → 최신 3건
- 최근 공지: `getCollection('notices')` → 최신 3건
- 멤버: `members.yaml` → 처음 4명

---

## 2. About (`/about`)

### 구조
- Page Header: "About" + breadcrumb
- 연구실 소개: 텍스트 (하드코딩)
- 연구 분야: 카드 3개 (인공생명, 진화연산, 자연모사 최적화)
- 비전: 텍스트

### 데이터
- 모두 하드코딩 (i18n JSON에서 가져오기)

---

## 3. Professor (`/professor`)

### 구조
- Page Header: "Professor" + breadcrumb
- 프로필 영역: 사진 + 이름/직함 + 소개 + 학력 + 연락처
- 연구 관심 분야: **Accordion 스타일** (shadcn)
  - 인공생명 (Artificial Life)
  - 진화 연산 (Evolutionary Computation)
  - 메타휴리스틱 최적화
  - 복잡계 시뮬레이션
- 주요 논문: 최근 3건 (publications.yaml에서)
- 참여 과제: 최근 과제 (projects.yaml에서)

### 데이터
- 프로필: 하드코딩
- 논문: `publications.yaml` → 최신 3건
- 과제: `projects.yaml` → 전체

---

## 4. Member (`/members`)

### 구조
- Page Header: "Member" + breadcrumb
- 섹션별 멤버 카드:
  - 대학원생 (석사/박사)
  - 학부 연구생
  - 졸업생 (접이식)

### 멤버 카드
- 프로필 사진 (원형)
- 이름, 과정
- 연구 키워드 뱃지
- 링크 아이콘 (GitHub, Scholar, Email)

### 데이터
- `members.yaml` → role별 그룹핑

---

## 5. Research (`/research`)

### 구조
- Page Header: "Research Projects" + breadcrumb
- 탭 필터: 진행중 / 완료
- 프로젝트 카드:
  - 기간 뱃지
  - 제목, 지원기관
  - 설명
  - 키워드 뱃지

### 데이터
- `projects.yaml` → status별 필터

---

## 6. Seminar (`/seminar`)

### 구조
- Page Header: "Seminar" + breadcrumb + 설명
- Filter Bar: 카테고리 탭 (전체/인공생명/진화연산/자연모사/기타) + 검색
- 세미나 리스트: 날짜 + 제목 + 발표자 + 태그
- 페이지네이션

### 세미나 상세 (`/seminar/[slug]`)
- 제목, 날짜, 발표자 정보
- 본문 (마크다운 렌더링)
- 사이드: 다운로드 (PDF/PPT), 관련 세미나

### 인터랙션 (React island)
- 카테고리 필터
- 검색 (Fuse.js, 클라이언트)
- 페이지네이션

### 데이터
- `getCollection('seminars')` → 날짜 역순 정렬

---

## 7. Notice (`/notice`)

### 구조
- Page Header: "Notice" + breadcrumb
- 공지 리스트: 날짜 + 제목 + 카테고리 뱃지
- 고정 공지 (pinned) 상단 배치
- 페이지네이션

### 공지 상세 (`/notice/[slug]`)
- 제목, 날짜, 카테고리
- 본문 (마크다운 렌더링)

### 데이터
- `getCollection('notices')` → pinned 우선, 날짜 역순

---

## 8. Contact (`/contact`)

### 구조
- Page Header: "Contact" + breadcrumb
- 좌: 연락처 정보 (주소, 이메일, 전화)
- 우: 지도 (카카오맵 임베드)

### 데이터
- 하드코딩
- 카카오맵: `<iframe>` 또는 Kakao Maps SDK

---

## 반응형 대응

### Desktop (1440px+)
- 시안 그대로

### Tablet (768px ~ 1439px)
- 2컬럼 → 1컬럼
- 패딩 축소 (60px → 24px)
- 네비 → 햄버거 메뉴

### Mobile (~ 767px)
- 단일 컬럼
- 네비 → 햄버거 메뉴
- 카드 풀 너비
- Hero 텍스트 크기 축소
