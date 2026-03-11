# SAL Lab — 콘텐츠 관리 가이드

## 콘텐츠 작성 방법

### 세미나 추가

1. `/admin` 접속 → GitHub 로그인
2. "세미나" → "새 세미나" 클릭
3. 제목, 발표자, 날짜, 카테고리 입력
4. PDF/PPT 파일 첨부 (Cloudflare R2에 자동 업로드)
5. 본문 작성 (마크다운)
6. "게시" 클릭 → 1~2분 후 사이트 반영

또는 직접 파일 생성:

```
src/content/seminars/2026-03-07-llm-training.md
```

```yaml
---
title: "Efficient Distributed Training of Large Language Models"
date: 2026-03-07
presenter: "김철수"
affiliation: "Distributed Lab"
category: "기타"
tags: ["LLM", "분산학습"]
pdf: ""
summary: "대규모 언어모델의 효율적 분산 학습 방법론 리뷰"
---

## 발표 내용

본문 마크다운 작성...
```

### 공지사항 추가

```
src/content/notices/2026-03-01-recruitment.md
```

```yaml
---
title: "2026 후기 석사/박사 연구원 모집"
date: 2026-03-01
category: "모집"
pinned: true
---

## 모집 안내

본문 마크다운 작성...
```

### 멤버 추가/수정

`src/content/members.yaml` 파일에 항목 추가:

```yaml
- name: "새 멤버"
  nameEn: "New Member"
  role: "석사과정"
  photo: "/images/members/new-member.jpg"
  research:
    - "연구 키워드"
  email: "new@jejunu.ac.kr"
  github: ""
  scholar: ""
  startYear: 2026
  graduated: false
```

사진은 `public/images/members/`에 추가 (권장: 400x400 이상, 정사각형)

### 논문 추가

`src/content/publications.yaml`에 항목 추가:

```yaml
- title: "논문 제목"
  authors: ["S. Park", "C. Kim"]
  venue: "저널/학회명"
  year: 2026
  type: "journal"
  tags: ["키워드"]
  doi: ""
  pdf: ""
```

### 연구 과제 추가

`src/content/projects.yaml`에 항목 추가:

```yaml
- title: "과제명"
  titleEn: "Project Title"
  status: "ongoing"
  period: "2024-2027"
  funding: "한국연구재단(NRF)"
  role: "연구책임자"
  pi: "박승민"
  keywords: ["키워드"]
  description: "과제 설명"
```

## 이미지 가이드

| 용도 | 권장 크기 | 형식 | 위치 |
|------|----------|------|------|
| 멤버 사진 | 400x400 | JPG/PNG | `public/images/members/` |
| 교수 사진 | 600x800 | JPG | `public/images/` |
| 세미나 PDF | - | PDF | Cloudflare R2 |
| 로고 | 원본 유지 | PNG/SVG | `public/images/` |

Astro `<Image />` 컴포넌트가 자동으로 WebP 변환 및 리사이징 처리.

## 배포

- `main` 브랜치에 push하면 자동 배포 (1~2분)
- Decap CMS에서 게시하면 자동으로 GitHub push → 배포
- 긴급 수정: GitHub에서 직접 파일 수정 후 커밋해도 동일하게 배포
