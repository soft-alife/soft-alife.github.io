# SAL Lab 웹사이트

제주대학교 컴퓨터공학과 **SAL (Soft Artificial Life) 연구실** 공식 웹사이트.
Astro 5 + Tailwind + React 정적 사이트, 한/영 이중 언어, GitHub Pages 자동 배포.

- 배포 주소: https://soft-alife.github.io/
- 저장소: `soft-alife/soft-alife.github.io`
- `main`에 push하면 GitHub Actions가 자동으로 빌드 & 배포합니다.

---

## 이 저장소의 특징

이 사이트는 **비개발자(교수님, 대학원생)** 가 AI 코딩 어시스턴트에게 **한국어로 자연어 요청**해서 유지보수하는 것을 전제로 설계되었습니다.
AI가 따라야 하는 규칙과 안전 영역은 [`CLAUDE.md`](./CLAUDE.md)에 정리되어 있습니다.
AI는 이 파일을 자동으로 읽고 규칙을 지킵니다 — 사용자는 그냥 원하는 걸 말하면 됩니다.

---

## AI로 수정하는 법

### 1. 준비물

- 터미널(터미널 앱) + 이 저장소 로컬 클론
- **Claude Code** 또는 **Codex CLI** 중 원하는 걸 설치
  - Claude Code: https://claude.com/claude-code
  - Codex CLI: https://github.com/openai/codex
- GitHub Desktop (commit & push 용, 선택 사항)

### 2. AI 실행

저장소 루트(`SAL-web/`)에서 터미널을 열고:

**Claude Code 사용 시**
```bash
claude
```

**Codex CLI 사용 시**
```bash
codex
```

둘 다 현재 디렉토리의 `CLAUDE.md`(Claude) / `AGENTS.md` 또는 `CLAUDE.md`(Codex) 를 자동으로 읽어서 규칙을 따릅니다.

### 3. 자연어로 요청하기

AI에게 한국어로 말하면 됩니다. 예시:

| 하고 싶은 일 | 이렇게 말하면 됨 |
| --- | --- |
| 멤버 추가 | "홍길동 학생을 석사과정으로 멤버에 추가해줘. 이메일은 hong@jejunu.ac.kr, 2026년 입학, 연구 키워드는 LLM Agent." |
| 졸업 처리 | "김철수를 졸업 처리해줘." |
| 공지 작성 | "2026년 여름 인턴 모집 공지 추가해줘. 날짜는 오늘, 카테고리는 모집." |
| 세미나 추가 | "다음 주 금요일 박영희 박사님 세미나 추가. 제목은 ..., 카테고리는 기계학습." |
| 논문 추가 | "AAAI 2026에 accept된 논문 추가해줘. 제목 ..., 저자 ..." |
| 채용 배너 문구 수정 | "홈 채용 배너 문구를 ...로 바꿔줘." |
| 홈/소개 텍스트 수정 | "About 페이지의 연구실 소개 문단을 ...로 바꿔줘." (한/영 동시 수정됨) |

AI는 [`CLAUDE.md`](./CLAUDE.md)에 정의된 **안전 영역(Safe Zone)** 안에서만 파일을 수정합니다. 디자인/레이아웃은 건드리지 않습니다.

### 4. 빌드 확인

AI가 작업을 마치면 자동으로 `npm run build`를 실행해서 빌드가 통과하는지 확인합니다.
빌드가 실패하면 AI가 오류를 읽고 스스로 수정하거나, 사용자에게 어떻게 할지 물어봅니다.

### 5. 배포

변경사항이 만족스러우면 commit & push:

**GitHub Desktop 사용 시**
1. 변경된 파일을 확인
2. 커밋 메시지 작성 후 "Commit to main"
3. "Push origin" 클릭

**터미널 사용 시**
```bash
git add -p           # 변경 내용 확인하며 스테이징
git commit -m "..."
git push
```

push 후 몇 분 안에 https://soft-alife.github.io/ 에 반영됩니다.
배포 상태는 저장소의 **Actions** 탭에서 확인할 수 있습니다.

---

## 로컬 개발 (개발자용)

```bash
npm install
npm run dev      # 로컬 미리보기 (http://localhost:4321)
npm run build    # 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 주요 문서

- [`CLAUDE.md`](./CLAUDE.md) — AI 어시스턴트가 따라야 하는 규칙, 안전 영역, 콘텐츠 스키마, 작업 레시피
- [`MAINTENANCE.md`](./MAINTENANCE.md) — 사용자가 AI에게 어떤 요청을 어떻게 할지에 대한 안내 (있는 경우)

## 라이선스

SAL Lab © Jeju National University
