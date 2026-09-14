# Freepoki

Cloudflare Pages Functions 기반 **Poki 전용** reverse proxy입니다.

## 기본 동작

- `poki.com`의 페이지를 Cloudflare Pages Functions에서 서버 측 `fetch()`하여 응답합니다.
- `poki.com` 및 모든 `*.poki.com` 서브도메인을 백엔드 경로로 처리합니다.
- `poki-cdn.com`, `*.poki-cdn.com`, `poki-gdn.com`, `*.poki-gdn.com`도 기본 지원합니다.
- `game-cdn.poki.com`, `games.poki.com`, `poki-auth.poki.com`, `t.poki.com`은 코드에 명시적으로 포함되어 있습니다.
- HTML/CSS/JS/JSON/SVG의 URL과 HTTPS 리다이렉트를 프록시 경로로 다시 매핑합니다.
- 이미지, WASM, 폰트, 오디오, 영상 등 바이너리 응답은 서버에서 스트리밍합니다.
- Poki 메인 HTML에는 `© Poki · poki.com` 표시를 유지합니다.

## 런타임

`functions/__poki_runtime.js`는 동적으로 생성되는 `fetch`, XHR, `src`, `href`, `action` 등의 요청 중 **Poki 계열 도메인만** 백엔드 경로로 변경합니다.

업로드 원본의 임의 외부 게임사 도메인을 런타임에서 자동 중계하는 부분은 공개 오픈프록시 위험을 줄이기 위해 포함하지 않았습니다. 서버 응답 안에서 이미 안전하게 서명된 외부 자산 URL은 `functions/[[path]].js`의 기존 서명 검증 구조를 따릅니다.

## Cloudflare Pages

- Framework preset: `None`
- Build command: 비움
- Build output directory: `.`
- 외부 서명 자산을 사용하는 경우 Secret: `PROXY_SIGNING_SECRET` (긴 랜덤 문자열 권장)

## 파일

- `functions/[[path]].js` — Poki 및 서버측 자산 프록시
- `functions/_middleware.js` — HTML/CSS 보정 및 런타임 주입
- `functions/__poki_runtime.js` — Poki 계열 동적 요청 처리

이 구성은 해당 콘텐츠에 필요한 사용·프록시 권한을 보유한 환경을 전제로 합니다.
