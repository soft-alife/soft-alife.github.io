# CMS(콘텐츠 관리자 페이지) 로그인 설정 가이드

사이트에 **https://soft-alife.github.io/admin** 관리자 페이지가 설치되어 있습니다.
뉴스·공지·세미나·블로그·멤버를 폼 화면에서 편집하면 자동으로 GitHub에 커밋되고 사이트에 배포됩니다.

"GitHub로 로그인" 버튼이 동작하려면 아래 **1회성 설정**이 필요합니다 (약 15분).
로그인 중개 서버로 무료 Cloudflare Workers + 공식 sveltia-cms-auth를 사용합니다.

> ⚠️ 이 설정에는 GitHub OAuth 비밀키가 나옵니다. 비밀키는 Cloudflare 환경변수에만
> 넣고, 절대 이 저장소(공개)에 커밋하지 마세요.

## 1단계. Cloudflare Workers에 인증 중개 배포

1. https://github.com/sveltia/sveltia-cms-auth 접속
2. README의 **"Deploy to Cloudflare Workers"** 버튼 클릭
   (Cloudflare 계정이 없으면 무료 가입)
3. 배포가 끝나면 Worker 주소가 생깁니다. 예:
   `https://sveltia-cms-auth.<계정이름>.workers.dev`
   → 이 주소를 메모해 두세요.

## 2단계. GitHub OAuth App 만들기

1. GitHub 로그인 → https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. 다음과 같이 입력:
   - Application name: `SAL Lab CMS`
   - Homepage URL: `https://soft-alife.github.io`
   - Authorization callback URL: `https://sveltia-cms-auth.<계정이름>.workers.dev/callback`
     (1단계 Worker 주소 뒤에 `/callback`)
3. 생성 후 **Client ID**를 메모하고, **Generate a new client secret**을 눌러
   **Client Secret**도 메모합니다 (한 번만 표시됨).

## 3단계. Worker에 환경변수 설정

Cloudflare 대시보드 → Workers & Pages → 1단계에서 만든 Worker → **Settings > Variables**:

| 변수 이름 | 값 |
| --- | --- |
| `GITHUB_CLIENT_ID` | 2단계의 Client ID |
| `GITHUB_CLIENT_SECRET` | 2단계의 Client Secret (Encrypt 체크) |
| `ALLOWED_DOMAINS` | `soft-alife.github.io` |

저장 후 Worker를 재배포(Deploy)합니다.

## 4단계. 사이트 설정에 Worker 주소 기입

`public/admin/config.yml` 파일에서 아래 줄의 주소를 1단계 Worker 주소로 교체 후 push:

```yaml
  base_url: https://REPLACE-WITH-YOUR-WORKER.workers.dev
```

(AI에게 "CMS base_url을 https://... 로 바꿔줘"라고 요청하면 됩니다.)

## 5단계. 사용

- https://soft-alife.github.io/admin 접속 → **Sign in with GitHub**
- **이 저장소에 쓰기 권한이 있는 GitHub 계정만** 저장할 수 있습니다.
  학생에게 권한을 주려면: 저장소 Settings > Collaborators에서 초대.
- 글을 저장하면 자동으로 커밋 → 1~2분 후 사이트에 반영됩니다.

## 관리 항목

| 메뉴 | 내용 | 저장 위치 |
| --- | --- | --- |
| News (기사) | 외부 기사 링크 또는 직접 작성 글 | `src/content/news/` |
| 공지사항 | 카테고리/고정 여부 포함 | `src/content/notices/` |
| 세미나 | 발표자/카테고리/태그 포함 | `src/content/seminars/` |
| Blog | 외부 글 링크 또는 직접 작성 글 | `src/content/blog/` |
| 멤버 | 멤버 목록 편집 (사진 업로드 가능) | `src/content/members.yaml` |
| 홈 배너 | 홈 배너 캐러셀 슬라이드 편집 (한/영, 링크) | `src/content/site.yaml` |
