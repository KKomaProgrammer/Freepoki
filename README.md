# Poki Cloudflare Pages Proxy

Cloudflare Pages Functions 기반 Poki 전용 프록시입니다.

- `poki.com`과 Poki 계열 호스트를 서버에서 가져와 응답
- 외부 게임/CDN 호스트는 `PROXY_SIGNING_SECRET` 기반 서명 경로 사용
- HTML/CSS 내 URL과 런타임 요청을 프록시 경로로 재작성
- `© Poki · poki.com` 표시 유지

## Cloudflare Pages

- Framework preset: `None`
- Build command: 비움
- Build output directory: `.`
- Secret: `PROXY_SIGNING_SECRET` (긴 랜덤 문자열 권장)
