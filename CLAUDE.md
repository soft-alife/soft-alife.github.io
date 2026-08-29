# SAL Lab Website — AI Maintenance Guide

이 문서는 **AI 코딩 어시스턴트(Claude Code, Cursor, Codex 등)** 가 이 저장소에서 작업할 때 따라야 하는 규칙과 작업 레시피입니다.
이 저장소는 비개발자(교수님, 대학원생) 가 AI에게 자연어로 요청해서 유지보수하는 것을 전제로 설계되었습니다.

> **사용자에게**: AI에게 어떤 말을 어떻게 하면 되는지는 [`MAINTENANCE.md`](./MAINTENANCE.md)를 보세요.
> **AI에게**: 이 파일을 끝까지 읽고, "8. 작업 후 검증"과 "9. 절대 하지 말 것"을 반드시 지키세요.

---

## 1. 이 사이트는 무엇인가

- 제주대학교 컴퓨터공학과 **SAL (Soft Artificial Life) 연구실** 공식 웹사이트
- **Astro 5 + Tailwind + React**로 만든 정적 사이트 (백엔드 없음)
- 한국어/영어 이중 언어, GitHub에 push 하면 자동 배포

## 2. 가장 중요한 원칙

1. **외형(레이아웃, 색상, 폰트, 간격)을 절대 바꾸지 않는다.** 사용자가 명시적으로 디자인 변경을 요청한 경우에만 예외.
2. **콘텐츠 변경은 반드시 "안전 영역(Safe Zone)" 안에서만 한다.** (3절 참고)
3. **확신이 없으면 추측하지 말고 사용자에게 한국어로 질문한다.**
4. **작업 후에는 반드시 `npm run build`를 실행해서 통과하는지 확인한다.** 빌드 실패는 곧 형식 오류이며, 수정 후 사용자에게 보고한다.
5. **요청받지 않은 일은 하지 않는다.** "겸사겸사 정리"는 금지.

## 3. 안전 영역 (Safe Zone) — 여기만 편집해도 된다

| 무엇을 바꾸려고 할 때 | 어떤 파일을 수정 |
| --- | --- |
| 구성원(멤버) 추가/수정/졸업 처리 | `src/content/members.yaml` |
| 논문 추가/수정 | `src/content/professor.yaml` (Publications 페이지 Journal Paper 탭은 여기의 SCI/SCIE·SCOPUS 학술지 + 탑티어 컨퍼런스에서 자동 생성) |
| 기사(News 탭) 추가 | `src/content/news/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 블로그 글(Blog 탭) 추가 | `src/content/blog/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 교수 실적 (논문/특허/기술이전/수상) 추가/수정 | `src/content/professor.yaml` |
| 연구 과제 추가/수정 | `src/content/projects.yaml` |
| 공지 추가 | `src/content/notices/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 세미나 추가 | `src/content/seminars/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 강의(Lecture 페이지) 추가/수정 | `src/content/lectures.yaml` (year/semester/level/title 형식은 파일 상단 주석 참고) |
| SALuv 사진 게시물 추가 | `src/content/saluv/YYYY-MM-DD-slug.md` (photos 배열에 사진 경로, /admin에서도 가능) |
| 멤버/교수 사진 | `public/images/members/`, `public/images/professor/` |
| 홈 채용 배너 문구/링크 (이중 언어) | `src/content/site.yaml` |
| CMS 관리자 페이지 설정 (필드/컬렉션) | `public/admin/config.yml` (로그인 설정은 [`docs/CMS-SETUP.md`](./docs/CMS-SETUP.md)) |

이 표에 없는 파일은 4절을 다시 확인하세요.

## 4. 절대 건드리지 말 것 (Do Not Touch)

사용자가 명시적으로 "이 파일을 고쳐줘"라고 지목하지 않는 한, 다음은 절대 수정 금지입니다.

- `src/layouts/` — 전체 페이지 골격
- `src/components/` — 재사용 컴포넌트
- `src/styles/` — 전역 CSS
- `src/lib/content.ts` — 콘텐츠 스키마 (예외: 사용자가 "새로운 필드 추가해줘"라고 명시하면 가능)
- `src/content/config.ts` — 콘텐츠 컬렉션 정의
- `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`
- `src/pages/` 안의 `.astro` 파일 (얇은 delegator이며, 한국어 페이지가 `lang="ko"`, 영어 페이지가 `lang="en"`로 공유 컴포넌트를 호출만 한다 — 절대 수정 금지)
- `src/components/pages/` 안의 공유 페이지 컴포넌트 (구조/마크업 수정 금지. 단, 텍스트 변경은 5.7 참고)
- 빌드 산출물: `dist/`, `node_modules/`

새로운 페이지나 컴포넌트를 만들지 마세요. 의존성을 추가하지 마세요. 디자인을 "개선"하지 마세요.

## 5. 콘텐츠 스키마 (필수 필드와 허용 값)

스키마의 진짜 정의는 [`src/lib/content.ts`](./src/lib/content.ts)에 있습니다. 잘못된 형식은 빌드가 즉시 거부합니다.

### 5.1 멤버 (`src/content/members.yaml`)

```yaml
members:
  - name: "홍길동"                       # 한국어 이름 (필수)
    nameEn: "Gildong Hong"               # 영문 이름 (필수)
    role: "M.S. Student"                 # 아래 enum 중 하나 (필수)
    photo: "/images/members/hong.jpg"    # public/ 기준 경로
    research:                            # 연구 키워드 배열
      - "LLM Agent"
    email: "hong@jejunu.ac.kr"
    github: "https://github.com/..."     # 없으면 ""
    scholar: ""                          # 없으면 ""
    startYear: 2026                      # 입학 연도 (정수)
    graduated: false                     # 졸업하면 true
```

`role` 허용값: `"M.S. Student"`, `"Ph.D. Student"`, `"M.S./Ph.D. Integrated"`, `"학부연구생"`, `"Post-doc"`

### 5.2 논문 (`src/content/publications.yaml`)

```yaml
publications:
  - title: "논문 제목"
    authors: ["S. Park", "et al."]       # 배열, 최소 1명
    venue: "저널/학회 이름"
    year: 2025
    type: "journal"                      # "journal" 또는 "conference"
    tags: ["기계학습", "BCI"]
    doi: ""                              # 없으면 ""
    pdf: ""                              # 없으면 ""
```

### 5.3 과제 (`src/content/projects.yaml`)

```yaml
projects:
  - title: "과제 한글 제목"
    titleEn: "Project English Title"
    status: "ongoing"                    # "ongoing" 또는 "completed"
    period: "2025-2027"
    funding: "한국연구재단"                # 지원기관
    ministry: "교육부"                    # 주무부처 (없으면 "")
    role: "연구책임자"
    pi: "박승민"
    keywords: ["키워드1", "키워드2"]
    description: "과제 설명"
```

### 5.4 공지 (`src/content/notices/YYYY-MM-DD-slug.md`)

파일명 규칙: `2026-04-15-recruit-summer.md`처럼 **날짜-슬러그.md**.

```markdown
---
title: "공지 제목"
date: 2026-04-15
category: "모집"          # "모집" | "일반" | "학술" | "행사"
pinned: false             # 상단 고정 여부
---

본문은 마크다운으로 자유롭게 작성.
```

### 5.9 기사/블로그 (`src/content/news/`, `src/content/blog/` 마크다운)

Publications 페이지의 News / Blog 탭에 표시. 파일명은 공지와 동일한 **날짜-슬러그.md** 규칙.

```markdown
---
title: "제목"
date: 2026-07-08
source: ""            # news 전용: 언론사 이름. blog는 author: "작성자"
link: ""              # 외부 기사/글 주소. 있으면 카드 클릭 시 새 탭으로 원문 이동
summary: "한 줄 요약"
---

link가 비어 있으면 "직접 작성한 글"로 취급되어, 카드 클릭 시 사이트 내
상세 페이지(/news/슬러그, /blog/슬러그)가 열리고 이 본문이 표시됩니다.
```

### 5.8 교수 실적 (`src/content/professor.yaml`)

교수 페이지에 표시되는 전체 실적. `publications.yaml`(연구실 대표 논문, 논문 페이지용)과는 별개입니다.

```yaml
journals:        # 학술지 논문
  - title: "논문 제목"
    venue: "학술지 이름"
    volume: "Vol.10, No.3, pp.1-9"   # 없으면 생략 가능
    date: "2024.06"                  # YYYY.MM — 최신순 정렬 기준
    index: "sci"                     # "sci" (SCI/SCIE) | "scopus" | "kci"
    impactFactor: "2.3"              # 없으면 생략
    quartile: "Q1 (상위 4.3%)"        # 없으면 생략
    authorRole: "corresponding"      # "first" | "corresponding" | "co", 모르면 생략
    note: "표지논문 선정"              # 특이사항, 없으면 생략
    doi: "10.3390/electronics10101158" # 있으면 카드 클릭 시 DOI 페이지로 이동, 없으면 생략
    url: ""                          # 지정 시 doi보다 우선하는 원문 링크 (예: ResearchGate 주소)
conferences:     # 학술대회 논문
  - title: "..."
    venue: "2024 한국지능시스템학회 춘계학술대회"
    date: "2024.04"
    tier: "domestic"                 # "top" (탑티어) | "international" | "domestic"
    authorRole: "corresponding"
    note: "우수논문상"
patents:         # 특허
  - title: "..."
    kind: "patent"                   # "patent" | "design" (생략 시 patent)
    country: "domestic"              # "domestic" (국내) | "international" (국제), 생략 시 domestic
    status: "registered"             # "registered" (등록) | "filed" (출원)
    applicationDate: "2020.11.10"
    applicationNumber: "10-2020-0148992"
    registrationDate: "2022.11.09"   # 등록된 경우만
    registrationNumber: "10-2466957" # 등록된 경우만
    note: "기술이전"                  # 특이사항
techTransfers:   # 기술이전 (금액은 공개 사이트에 표시하지 않음)
  - title: "..."
    year: 2023
    patentNumber: "10-2550317"
awards:          # 수상 경력
  - date: "2024.04.20"
    event: "2024 한국지능시스템학회 춘계학술대회"
    award: "우수논문상"
    note: ""                         # 수여 번호 등
```

교수 페이지에서 SCI/SCIE·SCOPUS·국제학술대회는 펼침, KCI·국내학술대회는 접힘 상태로 시작하고, 각 그룹은 최근 5건만 먼저 보여줍니다 (자동 처리 — 데이터만 추가하면 됨).

### 5.7 페이지 표시 텍스트 (`src/components/pages/*Page.astro`)

각 페이지의 한/영 표시 텍스트(섹션 제목, 본문 문구, 메타 정보 등)는 해당 공유 컴포넌트 상단의 `dict` 객체에 모여 있습니다. 예: `src/components/pages/AboutPage.astro` 첫 부분에:

```ts
const dict = {
  ko: {
    introHeading: "연구실 소개",
    introParagraphs: ["...", "..."],
    visionBody: "...",
  },
  en: {
    introHeading: "About the Lab",
    introParagraphs: ["...", "..."],
    visionBody: "...",
  },
} as const;
```

**텍스트 변경 시 규칙**:
1. `dict.ko`와 `dict.en`을 **반드시 함께** 수정한다. 한쪽만 수정하지 않는다.
2. 키를 추가/삭제하지 마라. 사용자가 명시 요청한 경우에만 가능. 추가했다면 양 언어 모두에 추가하고, 템플릿에서 그 키를 사용하는 곳도 같이 수정.
3. 마크업/HTML/Tailwind 클래스는 절대 건드리지 마라.
4. 컴포넌트 파일과 매핑:
   - `HomePage.astro` → 홈 (`/`, `/en/`)
   - `AboutPage.astro` → About 페이지
   - `MembersPage.astro` → 멤버 페이지
   - `ProfessorPage.astro` → 교수 페이지 (학력/경력 배열도 여기)
   - `PublicationsPage.astro` → 논문 페이지
   - `ResearchPage.astro` → 연구 과제 페이지
   - `ContactPage.astro` → 연락처 페이지
   - `NoticeIndexPage.astro` / `NoticeDetailPage.astro` → 공지 목록 / 상세
   - `SeminarIndexPage.astro` / `SeminarDetailPage.astro` → 세미나 목록 / 상세

### 5.6 사이트 텍스트 (`src/content/site.yaml`)

홈 상단 배너 캐러셀을 관리합니다. 슬라이드를 여러 개 등록하면 **10초마다 옆으로 자동 전환**됩니다. 모든 텍스트 필드는 `{ ko: "...", en: "..." }` 형태입니다.

```yaml
banners:
  - enabled: true                          # false면 이 슬라이드만 숨김
    link:
      ko: "/notice/2026-03-01-recruitment" # 사이트 내 경로 또는 외부 주소
      en: "/en/notice/2026-03-01-recruitment"
    label:                                 # 작은 라벨 (예: "OPEN POSITION", "NEWS")
      ko: "OPEN POSITION"
      en: "OPEN POSITION"
    title:
      ko: "..."
      en: "..."
    body:
      ko: "..."
      en: "..."
    button:
      ko: "자세히 보기"
      en: "Learn More"
  # 슬라이드를 추가하려면 위 블록을 복사해서 이어 붙이면 됩니다.
```

새 키를 추가하려면 `src/lib/content.ts`의 `SiteSchema`도 같이 업데이트해야 합니다. 한쪽만 바꾸면 빌드가 거부합니다.

### 5.5 세미나 (`src/content/seminars/YYYY-MM-DD-slug.md`)

```markdown
---
title: "세미나 제목"
date: 2026-04-15
presenter: "발표자 이름"
affiliation: "소속"        # 없으면 ""
category: "기계학습"       # "지능시스템" | "인공생명" | "기계학습" | "최적화 이론" | "기타"
tags: ["태그1"]
pdf: ""
slides: ""
summary: "한 줄 요약"
---

본문은 마크다운.
```

## 6. 작업 레시피 (요청 → 정확한 단계)

### 6.1 "OOO 학생을 멤버로 추가해줘"

1. 사용자에게 누락된 정보를 한 번에 모아서 묻기: 한글 이름, 영문 이름, 학위 과정, 연구 키워드, 이메일, 입학 연도, 사진 파일 (있으면).
2. 사진이 있으면 `public/images/members/{성씨}-{이름}.jpg` 경로를 안내. 없으면 photo는 빈 문자열로 두고 "사진을 나중에 추가하면 됩니다"라고 안내.
3. `src/content/members.yaml`의 `members:` 배열 끝에 새 항목 추가. 5.1 스키마를 정확히 따를 것.
4. `npm run build` 실행. 통과 확인.
5. 사용자에게 "추가 완료, 다음 단계: GitHub Desktop에서 commit & push"를 안내.

### 6.2 "OOO 학생을 졸업 처리해줘"

1. `members.yaml`에서 해당 멤버를 찾아 `graduated: false` → `graduated: true`로 변경.
2. 다른 필드는 건드리지 않는다. **삭제하지 않는다** — 졸업생 섹션에 표시되어야 한다.
3. `npm run build`로 검증.

### 6.3 "공지 추가해줘"

1. 사용자에게 묻기: 제목, 날짜, 카테고리(모집/일반/학술/행사), 본문, 상단 고정 여부.
2. 파일명을 `YYYY-MM-DD-{영문-슬러그}.md` 형식으로 결정 (예: `2026-04-15-summer-recruit.md`).
3. `src/content/notices/` 안에 새 파일 생성. 5.4 형식 준수.
4. `npm run build`로 검증.

### 6.4 "세미나 추가해줘"

1. 사용자에게 묻기: 제목, 날짜, 발표자, 소속, 카테고리, 태그, 요약, 본문.
2. 파일명: `YYYY-MM-DD-{슬러그}.md`. `src/content/seminars/`에 생성.
3. 5.5 형식 준수.
4. `npm run build`로 검증.

### 6.5 "논문 추가해줘"

1. `publications.yaml`의 `publications:` 배열 끝에 항목 추가. 5.2 형식 준수.
2. `authors`는 반드시 **배열** ("S. Park, J. Kim"이 아니라 `["S. Park", "J. Kim"]`).
3. `npm run build`로 검증.

### 6.6 "과제 추가/완료 처리"

1. 추가: `projects.yaml`에 5.3 형식으로 항목 추가.
2. 완료 처리: 해당 과제의 `status: "ongoing"`을 `"completed"`로 변경.
3. `npm run build`로 검증.

### 6.7 "홈 배너를 바꿔줘 / 배너에 OO 페이지 올려줘"

1. `src/content/site.yaml`의 `banners` 배열을 수정. 슬라이드 추가는 기존 블록 복사, 한국어 + 영어 둘 다 채울 것.
2. 특정 슬라이드를 숨기려면 해당 슬라이드의 `enabled: false`로만 변경.
3. 슬라이드가 2개 이상이면 홈에서 10초마다 자동 전환된다 (자동 처리).
4. `npm run build`로 검증.

### 6.8 "한/영 텍스트 표시 문구를 바꿔줘"

1. 사용자가 어느 페이지의 어떤 문구인지 정확히 지목해야 한다. 모호하면 질문하라.
2. 5.7의 매핑에 따라 해당 `src/components/pages/{Name}Page.astro`를 연다.
3. 파일 상단 `dict` 객체에서 해당 키를 찾아 `ko`와 `en` **양쪽 모두** 수정한다.
4. 마크업/HTML/Tailwind 클래스는 절대 건드리지 말고, dict 값만 교체.
5. `src/pages/*.astro`나 `src/pages/en/*.astro`는 절대 열지 마라 — 얇은 delegator일 뿐 텍스트가 없다.
6. `npm run build`로 검증.

## 7. 새로운 종류의 항목을 추가해 달라는 요청 (예: "수상 내역 섹션을 만들어줘")

이건 단순 콘텐츠 추가가 아니라 **구조 변경**입니다. 절대 마음대로 진행하지 말고:

1. 사용자에게 "이건 새로운 페이지/섹션을 만드는 작업이라 디자인 결정이 필요합니다. 개발자에게 한 번 보여주시는 게 안전합니다"라고 안내한다.
2. 사용자가 그래도 진행을 원하면, 먼저 어떤 정보를 어떤 페이지의 어디에 표시할지 합의한 후 진행한다.

## 8. 작업 후 검증 (반드시!)

모든 변경 후 다음을 순서대로:

```bash
npm run build
```

- **통과하면**: 사용자에게 "변경 완료. 빌드 통과. GitHub Desktop으로 commit & push 하시면 배포됩니다"라고 한국어로 보고.
- **실패하면**: 에러 메시지를 읽고 직접 수정. `[content]`로 시작하는 에러는 콘텐츠 스키마 위반이며 메시지에 정확한 위치(파일 + 항목 번호 + 필드)가 적혀 있다. 수정 후 다시 빌드. 두 번 시도해도 안 되면 사용자에게 에러 메시지 그대로 보여주고 어떻게 할지 물어본다.

## 9. 절대 하지 말 것 (Hard Stops)

- ❌ 새 페이지 만들기 (사용자가 명시 요청하지 않는 한)
- ❌ 새 컴포넌트 만들기
- ❌ CSS, Tailwind 클래스, 색상, 폰트, 간격 변경
- ❌ `package.json` 수정, 의존성 추가/업데이트
- ❌ Astro 설정 변경
- ❌ "리팩토링", "정리", "개선" 같은 명목으로 요청 범위를 벗어난 변경
- ❌ 빌드 실패를 무시하고 "끝났다"고 보고하기
- ❌ 졸업생 정보를 `members.yaml`에서 삭제하기 (졸업생 섹션에 표시되어야 함)
- ❌ `dict.ko`만 고치고 `dict.en`을 안 고치기 (또는 그 반대) — 항상 양쪽을 동시에 수정한다
- ❌ `git push --force` 또는 destructive git 명령
- ❌ `.env`, 비밀 정보, 자격 증명 파일에 접근하기

## 10. 한국어로 응답하기

사용자(교수님/학생)는 한국어로 요청합니다. 응답도 **한국어로**, 짧고 명확하게 하세요.
변경한 파일 목록과 다음 단계(commit & push 안내)를 마지막에 한 줄로 알려주세요.

---

## 세션 작업 이력 (2026-07 ~ 2026-08)

> 이 절은 로컬 Claude Code 세션 기록이 유실될 것을 대비해, 새 환경(Mac 등)에서 이어서 작업할 수 있도록 남기는 **컨텍스트 요약**입니다. 위 1~10절의 규칙·스키마는 그대로 유효하며, 여기서는 "왜 지금 이런 구조인가"와 "무엇이 남았는가"만 적습니다.

### 11.1 타임라인 (커밋 기준)

| 날짜 | 커밋 | 내용 |
| --- | --- | --- |
| 2026-07-07 | `5404258` | 교수 이력서(PDF, `F:\workspace\Sal_Lab\resources\`)를 바탕으로 교수 실적 전체 등록 — `professor.yaml` 신설(학술지 71: SCI/SCIE 16·SCOPUS 14·KCI 41 / 학술대회 85: 국제 16·국내 69 / 특허 26 / 기술이전 1 / 수상 19), 과제 28건 실데이터(`projects.yaml`, `ministry` 필드 신설, 2019년 이후 시작 과제는 `role: "연구책임자"`), `PublicationGroup.tsx` 접이식 컴포넌트 신설. 멤버 분류 세분화, 예시 공지 2건·예시 세미나 3건 삭제 |
| 2026-07-07 | `f5330ff` | Publications 탭(Journal Paper/News/Blog) 신설, 배지 색상 체계 정리, 카드 순서 배지→제목→기타, IF·Q 검정 굵게, 부교수 배지 파랑, 연구책임자 배지 노랑 |
| 2026-07-07 | `ed92e32` | Research/Publications/Notice 검색창 + "전체" 탭 (`NoticeList.tsx` 신설) |
| 2026-07-08 | `fd101cd` | 실적 전체 링크 연결 (DOI/KIPRIS/DBpia/NTIS), 카드 클릭 이동 + ↗ 아이콘 + 텍스트 드래그 허용, News/Blog를 yaml → 마크다운 컬렉션으로 전환하고 사이트 내 상세 페이지 추가 |
| 2026-07-08 | `12b55ed` | Sveltia CMS(/admin) 도입 — 관리 항목: 뉴스·공지·세미나·블로그·멤버. 인증은 Cloudflare Worker `https://sveltia-cms-auth.jnusal-admin.workers.dev` (설정 절차 `docs/CMS-SETUP.md`) |
| 2026-07-08 | (rebase 후 push) | 현대자동차 제조솔루션본부 대상 VE 교육 기사 `src/content/news/2026-07-03-hyundai-ve-lecture.md` (사진 5장, 웹 최적화). 마크다운 본문 스타일(`##`·목록) 수정 — `prose` 플러그인 미설치 문제를 요소별 직접 스타일로 대체, 공지 상세도 함께 수정. /admin에서 들어온 멤버 커밋(이장훈 추가 등)과 rebase로 병합 |
| 2026-08-07 | `f2906d1` | 홈 개편: 세미나 섹션 → News 섹션, 홈 배너 회색 캐러셀(10초 자동 전환·드래그 스와이프·점 네비게이션), News/Blog 독립 페이지·메뉴 분리, Publications는 논문 전용으로 |
| 2026-08-07 | `b22800b` | 연구실 호수 406호 → **425호**, 대표 이메일 sal@ → **spark@jejunu.ac.kr** (Contact + 푸터, 한/영) |
| 2026-08-07 | `745db14` | /admin에 "홈 배너" 편집 메뉴 추가 |
| 2026-08-09 | `f16329b` | 메뉴바 2단 드롭다운 개편, Alumni·Lecture·SALuv 신규 페이지, News/Blog/Notice 게시판화(10개/페이지, 페이지 번호 항상 표시), Publications를 교수 페이지 스타일 접이식 7그룹으로 재구성(`PublicationsBrowser.tsx` 신설, `PaperList.tsx` 삭제), 특허 등록→출원 정렬, 과제 3건 완료 처리, 멤버 과정 명칭 개편, 배너 진행바 제거, 학력 표기 변경, BCI 연구분야 추가, 경로 표시 영문 통일 |

### 11.2 확정된 결정 사항

**역할 분담 — /admin(CMS) vs Claude Code**

| 대상 | 수정 방법 |
| --- | --- |
| 뉴스 · 공지 · 세미나 · 블로그 · 멤버 · 홈 배너 · SALuv | **/admin** (Sveltia CMS). Claude에게 요청해도 됨 |
| 교수 페이지 실적(논문·특허·기술이전·수상·과제·경력·학력·소개글) | **Claude Code에 요청** — 구조화 필드(분류/DOI/저자구분)가 많아 폼 편집이 오히려 위험하다고 판단해 CMS에서 제외 |
| Publications 페이지 | `professor.yaml`에서 **자동 생성**. 별도 관리 없음. `src/content/publications.yaml`은 어느 페이지에서도 사용되지 않는 잔존 파일 (5.2 절 스키마는 참고용일 뿐, 실제 논문 등록은 5.8의 `professor.yaml`에 한다) |
| 채용 배너 문구, 페이지 dict 문구, 디자인 | Claude Code |

**Publications 페이지 구성 (2026-08-09 확정)** — 접이식 그룹 7개, 순서·기본 상태:
SCI/SCIE(펼침) · SCOPUS(펼침) · KCI(접힘) · 국제학술대회(펼침, 탑티어 포함) · 국내학술대회(접힘) · 기술이전(펼침) · 특허(펼침, **등록→출원 순, 각각 최신순**). 각 그룹 최근 5건 + "전체 보기". 검색창 유지(검색 시 전 그룹 펼침, 미일치 그룹 숨김). News/Blog 탭은 제거됨(독립 페이지로 이동).

**배지 색상 체계**
- 노랑 (`#FEF3C7`/`#92400E`): SCI/SCIE, 탑티어 컨퍼런스, 국제특허, 제1저자, 연구책임자, 국가연구과제
- 파랑 (`#DBEAFE`/`#1E40AF`): 국제학술대회, 국내특허 등록, 교신저자, 부교수
- 연푸른색 (`#EFF6FF`/`#1D4ED8`): SCOPUS
- 회색 (`#F5F5F5`/`#52525B`): KCI, 국내학술대회, 국내특허 출원, 공동저자, 날짜 배지
- IF·Q는 검정 굵게. 카드 순서는 **배지 → 제목 → 기타**. "최근 5년 날짜 강조"는 만들었다가 사용자 요청으로 제거됨(다시 넣지 말 것).

**링크 규칙 (우선순위)**
- 학술지/학술대회: `url` → `doi` → 없음. DOI가 "Content Not Found"인 경우 ResearchGate 등으로 `url` 지정
- 특허: `url` → 자동 KIPRIS DOI `https://doi.org/10.8080/{출원번호 하이픈 제거}` (등록·출원 모두, 디자인등록 제외)
- 기술이전: 근거 특허(등록번호 일치)와 같은 KIPRIS 페이지
- 과제: `national: true`인 것만 노란 "국가연구과제" 배지 + NTIS 검색 링크. **NTIS에서 박승민 교수가 연구자로 확인된 5건만** 유지 (그 외는 배지 없음)
- News/Blog: `link` 있으면 외부 새 탭 + ↗, 없으면 사이트 내 상세 페이지

**탑티어 컨퍼런스**: 판정 기준은 `F:\workspace\Sal_Lab\resources\` 의 우수학술대회 목록 PDF(BK21/KIISE). 현재 `tier: "top"`인 논문 **0건**. 교수님의 ICCAD 2025는 반도체 분야 ICCAD와 이름만 같은 다른 학회(Control, Automation and Diagnosis)라 국제학술대회로 분류함.

**멤버 페이지**: "대학원생" 상위 제목 없이 박사과정 / 석사과정 / 학부과정 섹션(영어 Ph.D. Course / M.S. Course / Undergraduate Course). 석박사통합은 박사과정 섹션. 졸업생은 Alumni 페이지로 이동. 표시 순서는 `members.yaml` 배열 순서 그대로. 2026-08-09 기준 박민건은 석사과정.

**홈 배너 캐러셀**: 회색 배경, 10초 자동 전환, 드래그 스와이프, 점 네비게이션. 진행바 없음, 마우스 올려도 멈추지 않음. Sveltia CMS는 커스텀 프리뷰를 지원하지 않아 "저장 후 실제 홈에서 확인" 방식으로 운영하기로 확정(Decap 전환 안 함).

**네비게이션**: Introduction▾(About SAL Lab. / Professor / Members / Alumni) · Publications · Projects · Seminar · Lecture · Board▾(News / SALuv) · Notice · Contact. Blog는 메뉴에서만 빠지고 `/blog` 페이지·데이터는 남아 있음. 한국어 페이지의 경로 표시(SAL > …)도 전부 영문 메뉴명으로 통일.

**교수 학력(한국어)**: "중앙대학교 제어및시스템공학, 지능시스템전공, 공학박사 (2019.02)" / "중앙대학교 전자전기공학부, 공학사 (2010.02)". 영어는 기존 표기 유지.

**보안**: 저장소는 공개. 이력서·캡처 등 원본 자료는 저장소 밖 `F:\workspace\Sal_Lab\resources\`에 둔다(새 Mac에서는 동일 역할의 폴더를 저장소 밖에 만들 것). 기술이전 금액은 사이트에 표시하지 않는다.

### 11.3 미완료 / 후속 작업 후보

- **탑티어 컨퍼런스 지정** — 교수님이 지정하면 `professor.yaml`에서 해당 학술대회 논문 `tier: "top"`으로 변경
- **미연결 링크**: 학술지 5편(DOI 미등록/쪽수 없음), 학술대회 13편(행사 페이지 소멸), 디자인등록 특허 1건. 개별 링크를 받으면 `url:` 한 줄로 추가
- **과제별 역할**: 2018년 이전 시작 과제 11건은 역할 미표시
- **Lecture 페이지 데이터 비어 있음** — 교수님 학기별 과목 목록을 받아 `lectures.yaml` 채우기
- **Alumni 비어 있음** (졸업생 없음) — 졸업 처리 시 자동 표시
- **예시 콘텐츠 잔존**: 세미나 "예시 세미나 제목 1" 1건, Blog 예시 글 1건
- **현대차 기사 본문**: /admin 편집 중 생긴 빈 `## ` 제목 한 줄이 남아 있을 수 있음 — 정리 여부 미확정
- **방문자 통계**: Cloudflare Web Analytics(무료, 쿠키 없음) 제안만 한 상태. 사용자가 토큰을 주면 스크립트 삽입
- **노션 연동(News)**: 빌드 시점 Notion API 방식 가능하다고 안내만 함. 미착수
- **BCI 연구분야**: 교수 페이지 아코디언에는 추가했으나 홈 "Research Areas" 4칸 그리드에는 미추가(레이아웃 문제)
- `publications.yaml` 잔존 파일 삭제 여부 미결정

### 11.4 주의사항 (Pitfalls)

- **작업 시작 전 반드시 `git pull` (또는 fetch 후 rebase)**. /admin 저장은 GitHub에 직접 커밋되므로 로컬이 뒤처져 있는 경우가 잦다. 파일이 겹치지 않으면 rebase로 안전하게 합쳐진다.
- `@tailwindcss/typography`가 설치되어 있지 않아 `prose` 클래스는 아무 효과가 없다. 마크다운 본문 스타일은 상세 페이지 컴포넌트의 Tailwind arbitrary variant(`[&_h2]:...`)로 직접 지정되어 있다. 의존성 추가 금지 원칙 유지.
- Cloudflare Worker 환경변수: 대시보드에서 넣을 때 **변수 이름 앞 공백**이 들어가 인증이 실패했던 이력이 있음. Claude Code의 `!` 명령은 비대화형이라 `wrangler secret put`이 빈 값을 저장한다 — 비밀값 입력은 사용자가 일반 터미널에서 직접 실행해야 한다.
- 비용: GitHub Pages + Actions + Sveltia CMS + Cloudflare Workers 무료 플랜 구성. 카드 등록 없음. 유료 전환 불필요.
- 페이지네이션은 글이 1개여도 **항상 표시**(사용자 확정). 숨기지 말 것.
- SALuv는 **썸네일 그리드** 형태(게시판 행 형태로 바꿨다가 되돌림). 페이지 번호만 하단 표시.
- 미리보기는 `npm run build` 후 `npm run preview`(http://localhost:4321). 브라우저 캐시가 접이식 상태를 복원해 "전부 펼쳐져 보이는" 착시가 있을 수 있으니 강제 새로고침으로 확인.
- 카드 클릭 이동 + 텍스트 드래그 공존: 드래그(선택) 중에는 클릭 이동이 발생하지 않도록 구현되어 있음. 링크 카드 수정 시 이 동작을 깨지 않도록 주의.
- 이력서 원본 PDF, 캡처 등 개인 자료는 절대 저장소 안에 두지 않는다 (공개 저장소).
