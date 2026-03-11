# SAL Lab Homepage — 기술 스펙 문서

## 1. 프로젝트 개요

- **프로젝트명**: SAL (Soft A-Life) Laboratory Homepage
- **목적**: 제주대학교 컴퓨터공학과 SAL 연구실 공식 웹사이트
- **지도교수**: 박승민
- **핵심 요구사항**: 높은 SEO, 최상의 성능(Lighthouse 100점 목표), 세미나/공지 콘텐츠 관리

---

## 2. 기술 스택

| 구분 | 기술 | 버전 | 비고 |
|------|------|------|------|
| 프레임워크 | Astro | 5.x | 정적 사이트 생성 (SSG) |
| UI 라이브러리 | React | 19.x | Astro island (인터랙티브 컴포넌트만) |
| 스타일링 | Tailwind CSS | 4.x | + shadcn/ui 컴포넌트 |
| 콘텐츠 관리 | Astro Content Collections | - | 마크다운 + YAML 스키마 |
| 관리자 페이지 | Decap CMS | - | /admin 경로, GitHub OAuth |
| 파일 스토리지 | Cloudflare R2 | - | 세미나 PDF/PPT 저장 |
| 배포 | Vercel | - | GitHub push 시 자동 배포 |
| 소스 관리 | GitHub | - | Private repo |

---

## 3. 페이지 구조

### 3.1 라우팅

```
/ (ko)                    ← 한국어 (기본)
├── /                     ← Homepage
├── /about                ← 연구실 소개
├── /professor            ← 지도교수 소개
├── /members              ← 연구원 목록
├── /research             ← 연구 과제
├── /seminar              ← 세미나 목록
├── /seminar/[slug]       ← 세미나 상세
├── /notice               ← 공지사항
├── /notice/[slug]        ← 공지 상세
├── /contact              ← 연락처/위치

/en                       ← 영어
├── /en                   ← Homepage (EN)
├── /en/about
├── /en/professor
├── ...
```

### 3.2 네비게이션 순서

```
Home → About → Professor → Member → Research → Seminar → Notice → Contact
```

### 3.3 페이지별 상세

| 페이지 | 타입 | 데이터 소스 | 인터랙션 |
|--------|------|-----------|---------|
| Home | 정적 | 하드코딩 + 최신 세미나/공지 참조 | 없음 |
| About | 정적 | 하드코딩 | 없음 |
| Professor | 정적 | 하드코딩 | Accordion (연구 관심 분야) |
| Member | 정적 | `members.yaml` | 없음 |
| Research | 정적 | `projects.yaml` | 탭 필터 (진행중/완료) |
| Seminar | 준동적 | `seminars/*.md` | 카테고리 필터, 검색, 페이지네이션 |
| Notice | 준동적 | `notices/*.md` | 페이지네이션 |
| Contact | 정적 | 하드코딩 | 카카오맵 임베드 |

---

## 4. 콘텐츠 스키마

### 4.1 세미나 (seminars/*.md)

```yaml
---
title: "Efficient Distributed Training of Large Language Models"
date: 2026-03-07
presenter: "김철수"
affiliation: "Distributed Lab"
category: "인공생명" | "진화연산" | "자연모사" | "기타"
tags: ["LLM", "분산학습"]
pdf: "https://r2.sal-lab.dev/seminars/2026-03-07-llm.pdf"  # R2 URL
slides: ""  # 선택
summary: "대규모 언어모델의 효율적 분산 학습 방법론 리뷰"
---

세미나 본문 내용 (마크다운)
```

### 4.2 공지사항 (notices/*.md)

```yaml
---
title: "2026 후기 석사/박사 연구원 모집"
date: 2026-03-01
category: "모집" | "일반" | "학술" | "행사"
pinned: false
---

공지 본문 내용 (마크다운)
```

### 4.3 멤버 (members.yaml)

```yaml
members:
  - name: "김철수"
    nameEn: "Cheolsu Kim"
    role: "석사과정"  # 석사과정 | 박사과정 | 학부연구생 | 졸업생
    photo: "/images/members/kim.jpg"
    research:
      - "분산 학습"
      - "LLM"
    email: "kim@jejunu.ac.kr"
    github: "https://github.com/kim"
    scholar: ""
    startYear: 2025
    graduated: false
```

### 4.4 논문 (publications.yaml)

```yaml
publications:
  - title: "Emergent Behaviors in Multi-Agent Artificial Life Simulations"
    authors: ["S. Park", "C. Kim", "Y. Lee"]
    venue: "IEEE Transactions on Evolutionary Computation"
    year: 2026
    type: "journal"  # journal | conference
    tags: ["인공생명", "멀티에이전트"]
    doi: "https://doi.org/..."
    pdf: ""
```

### 4.5 연구 과제 (projects.yaml)

```yaml
projects:
  - title: "진화 연산 기반 대규모 조합 최적화 문제 해결 연구"
    titleEn: "Solving Large-Scale Combinatorial Optimization via Evolutionary Computation"
    status: "ongoing"  # ongoing | completed
    period: "2024-2027"
    funding: "한국연구재단(NRF)"
    role: "연구책임자"
    pi: "박승민"
    keywords: ["진화연산", "조합최적화"]
    description: "..."
```

---

## 5. 디자인 시스템

### 5.1 shadcn/ui 기반 토큰

```
색상 (shadcn neutral):
  --foreground:     #0A0A0A
  --muted:          #71717A
  --muted-2:        #A1A1AA
  --border:         #E4E4E7
  --secondary:      #F4F4F5
  --background:     #FAFAFA
  --card:           #FFFFFF
  --accent:         #D4735E  (SAL 브랜드 테라코타)
  --navy:           #1E3A5F  (탑바)
  --dark:           #18181B  (버튼, 활성 필터)

타이포그래피:
  --font-family:    "Inter", sans-serif
  --heading:        700 weight
  --body:           400 weight
  --caption:        12px, #71717A

간격:
  --radius:         8px (카드)
  --padding-card:   20px 24px
  --padding-page:   40px 60px
  --gap-section:    48px

컴포넌트:
  카드:       1px #E4E4E7 border, 8px radius, white bg
  뱃지:       #F4F4F5 bg, #52525B text, 9999px radius (pill)
  버튼:       #18181B bg, white text, 8px radius
  Accordion:  하단 1px #E4E4E7 border, chevron-down 아이콘
  필터탭:     8px radius, 활성=#18181B fill/white text
  검색바:     8px radius, 1px #E4E4E7 border, #A1A1AA placeholder
```

### 5.2 반응형 브레이크포인트

```
Desktop:  1440px (디자인 기준)
Tablet:   768px
Mobile:   375px
```

---

## 6. 다국어 (i18n)

- 기본 언어: 한국어 (`/`)
- 영어: `/en/*`
- Astro 공식 i18n 라우팅 사용
- 번역 파일: `src/i18n/ko.json`, `src/i18n/en.json`
- 언어 전환: 탑바 KR / EN 토글

---

## 7. SEO & 성능

### 7.1 SEO

- `<title>`, `<meta description>` 페이지별 설정
- Open Graph / Twitter Card 메타태그
- 구조화된 데이터 (JSON-LD): Organization, Person, Article
- `sitemap.xml` 자동 생성 (`@astrojs/sitemap`)
- `robots.txt`
- Canonical URL

### 7.2 성능

- Astro SSG: 순수 HTML 출력, JS 최소화
- 이미지: `<Image />` 컴포넌트 (WebP 변환, lazy loading, srcset)
- 폰트: Inter — `font-display: swap`, preload
- CSS: Tailwind purge (사용하지 않는 클래스 제거)
- 목표: Lighthouse 100/100/100/100

---

## 8. 관리자 (Decap CMS)

### 8.1 접속

- URL: `https://sal-lab.dev/admin`
- 인증: GitHub OAuth (지정된 GitHub 계정만 허용)

### 8.2 관리 가능 콘텐츠

| 콘텐츠 | 작업 |
|--------|------|
| 세미나 | 작성, 수정, 삭제, PDF 업로드 |
| 공지사항 | 작성, 수정, 삭제 |
| 멤버 | 추가, 수정, 사진 업로드 |
| 논문 | 추가, 수정 |
| 연구 과제 | 추가, 수정 |

### 8.3 파일 업로드 흐름

```
관리자가 PDF 첨부
→ Decap CMS가 Cloudflare R2에 업로드
→ R2 URL을 마크다운 frontmatter에 기록
→ GitHub에 커밋
→ Vercel 자동 빌드
→ 사이트 반영
```

---

## 9. 배포 파이프라인

```
GitHub (main branch)
  ↓ push
Vercel (자동 감지)
  ↓ astro build
정적 파일 생성
  ↓ 배포
https://sal-lab.dev (또는 sal.jejunu.ac.kr)
```

- Preview: PR 생성 시 Vercel preview 배포
- Production: `main` push 시 자동 배포
- 빌드 시간: ~30초 (정적 사이트)

---

## 10. 프로젝트 디렉토리 구조

```
sal-web/
├── public/
│   ├── images/
│   │   ├── logo-sal.png
│   │   ├── jeju-logo.png
│   │   ├── professor-photo.jpg
│   │   └── members/
│   ├── fonts/
│   └── admin/           ← Decap CMS config
│       └── config.yml
├── src/
│   ├── components/
│   │   ├── ui/          ← shadcn/ui 컴포넌트
│   │   ├── layout/
│   │   │   ├── TopBar.astro
│   │   │   ├── Nav.astro
│   │   │   └── Footer.astro
│   │   └── sections/    ← 페이지 섹션 컴포넌트
│   ├── content/
│   │   ├── seminars/
│   │   ├── notices/
│   │   ├── members.yaml
│   │   ├── publications.yaml
│   │   └── projects.yaml
│   ├── i18n/
│   │   ├── ko.json
│   │   └── en.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── professor.astro
│   │   ├── members.astro
│   │   ├── research.astro
│   │   ├── seminar/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── notice/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── contact.astro
│   │   └── en/
│   │       └── ... (동일 구조)
│   └── styles/
│       └── globals.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── docs/
    ├── SPEC.md           ← 이 문서
    └── DESIGN-TOKENS.md
```
