# Game Assist Pages — 초저트래픽 정적판

이 저장소는 Cloudflare Pages에 **정적 UI만** 배포하는 초저트래픽 구성입니다.

- `functions/` 없음
- reverse proxy 없음
- Poki / 이미지 / WASM / 영상 / 게임 파일의 서버측 fetch 없음
- `portal-v1.html` 한 파일에 UI/CSS/JS 모두 포함
- `portal-v1.html`은 1년 immutable 브라우저 캐시
- 확장 프로그램에서는 이 페이지를 박스 안에 그대로 로드
- 게임 목록/게임 URL 해석/실제 플레이 트래픽은 사용자 브라우저 → Poki로 직접 연결

## Cloudflare Pages 배포

- Framework preset: `None`
- Build command: 비움
- Build output directory: `.`
- Functions/Workers 연결 불필요
- 별도 API/Secret 불필요

기존 프록시 배포에서 사용하던 `functions/` 폴더와 서버측 프록시 코드는 완전히 제거해야 합니다.

## 직접 접속

`/portal-v1.html`을 브라우저에서 직접 열 수 있습니다. 확장 프로그램 밖에서는 게임 선택 시 Poki 원본 페이지를 새 탭으로 직접 열며 Cloudflare가 게임 트래픽을 전달하지 않습니다.

## 캐시

`_headers`에서 `/portal-v1.html`에 다음 정책을 적용합니다.

```text
Cache-Control: public, max-age=31536000, immutable
```

UI를 수정할 때는 같은 파일을 덮어쓰기보다 `portal-v2.html`처럼 새 파일명으로 배포해 장기 캐시와 충돌하지 않게 하세요.
