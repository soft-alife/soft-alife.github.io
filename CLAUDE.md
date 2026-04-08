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
| 논문 추가/수정 | `src/content/publications.yaml` |
| 연구 과제 추가/수정 | `src/content/projects.yaml` |
| 공지 추가 | `src/content/notices/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 세미나 추가 | `src/content/seminars/YYYY-MM-DD-slug.md` 새 파일 생성 |
| 멤버/교수 사진 | `public/images/members/`, `public/images/professor/` |
| 홈 채용 배너 문구/링크 (이중 언어) | `src/content/site.yaml` |

이 표에 없는 파일은 4절을 다시 확인하세요.

## 4. 절대 건드리지 말 것 (Do Not Touch)

사용자가 명시적으로 "이 파일을 고쳐줘"라고 지목하지 않는 한, 다음은 절대 수정 금지입니다.

- `src/layouts/` — 전체 페이지 골격
- `src/components/` — 재사용 컴포넌트
- `src/styles/` — 전역 CSS
- `src/lib/content.ts` — 콘텐츠 스키마 (예외: 사용자가 "새로운 필드 추가해줘"라고 명시하면 가능)
- `src/content/config.ts` — 콘텐츠 컬렉션 정의
- `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`
- `src/pages/` 안의 `.astro` 파일 (콘텐츠 변경은 위 YAML/MD에서 한다 — 페이지를 직접 고치는 게 아니다)
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
    funding: "한국연구재단"
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

### 5.6 사이트 텍스트 (`src/content/site.yaml`)

홈 채용 배너처럼 시기마다 바뀌는 이중 언어 텍스트를 모아둔 곳입니다. 모든 텍스트 필드는 `{ ko: "...", en: "..." }` 형태입니다.

```yaml
recruit:
  enabled: true                            # false면 배너 자체 숨김
  link:
    ko: "/notice/2026-03-01-recruitment"   # 한국어 페이지에서 클릭 시 이동
    en: "/en/notice/2026-03-01-recruitment"
  label:                                   # 작은 라벨 (예: "OPEN POSITION")
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

### 6.7 "채용 배너 문구/링크를 바꿔줘"

1. `src/content/site.yaml`의 `recruit` 섹션을 수정. 한국어 + 영어 둘 다 채울 것.
2. 채용 시즌이 끝나 배너를 숨기려면 `enabled: false`로만 변경.
3. `npm run build`로 검증.

### 6.8 "한/영 텍스트 표시 문구를 바꿔줘"

> **주의**: 페이지에 하드코딩된 일부 텍스트는 현재 단계에서는 페이지 파일 안에 있습니다. 향후 `site.yaml`로 분리될 예정입니다. 그 전까지는 다음 규칙을 따릅니다.

1. 사용자가 어느 페이지의 어떤 문구인지 정확히 지목해야 한다. 모호하면 질문하라.
2. 한국어 페이지 (`src/pages/*.astro`)와 영어 페이지 (`src/pages/en/*.astro`) **양쪽을 동시에** 수정해야 한다. 한쪽만 고치면 안 된다.
3. 디자인/마크업/클래스명은 절대 바꾸지 말고, 텍스트 노드만 교체.
4. `npm run build`로 검증.

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
- ❌ 한국어 페이지만 고치고 영어 페이지를 안 고치기 (또는 그 반대)
- ❌ `git push --force` 또는 destructive git 명령
- ❌ `.env`, 비밀 정보, 자격 증명 파일에 접근하기

## 10. 한국어로 응답하기

사용자(교수님/학생)는 한국어로 요청합니다. 응답도 **한국어로**, 짧고 명확하게 하세요.
변경한 파일 목록과 다음 단계(commit & push 안내)를 마지막에 한 줄로 알려주세요.
