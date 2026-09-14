export function onRequest() {
  const js = String.raw`(() => {
  'use strict';
  const tag = document.currentScript;
  if (!tag || window.__freePokiRuntimeInstalled) return;
  window.__freePokiRuntimeInstalled = true;

  const ORIGIN = location.origin;
  const POKI_PREFIX = '/__poki_host/';
  const upstream = tag.dataset.upstream || 'https://poki.com/';

  function pokiBase(hostname) {
    const host = String(hostname || '').toLowerCase().replace(/\.$/, '');
    if (host === 'poki.com') return ORIGIN;
    if (host.endsWith('.poki.com') || host === 'poki-cdn.com' || host.endsWith('.poki-cdn.com') || host === 'poki-gdn.com' || host.endsWith('.poki-gdn.com')) {
      return ORIGIN + POKI_PREFIX + encodeURIComponent(host);
    }
    return '';
  }

  function proxify(value) {
    if (value == null) return value;
    const raw = value instanceof URL ? value.href : String(value);
    if (!raw || /^(?:data|blob|javascript|about|mailto|tel):/i.test(raw)) return value;
    let url;
    try { url = new URL(raw, upstream); } catch (_) { return value; }
    if (url.origin === ORIGIN) return url.href;
    if (url.protocol !== 'https:') return value;
    const base = pokiBase(url.hostname);
    return base ? base + url.pathname + url.search + url.hash : value;
  }

  function patch(proto, prop) {
    try {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc || !desc.get || !desc.set || !desc.configurable) return;
      Object.defineProperty(proto, prop, {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get,
        set(value) { return desc.set.call(this, proxify(value)); }
      });
    } catch (_) {}
  }

  const nativeFetch = window.fetch;
  if (nativeFetch) {
    window.fetch = function(input, init) {
      try {
        if (input instanceof Request) {
          const next = proxify(input.url);
          if (next !== input.url) input = new Request(next, input);
        } else input = proxify(input);
      } catch (_) {}
      return nativeFetch.call(this, input, init);
    };
  }

  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    const args = Array.from(arguments);
    args[1] = proxify(url);
    return nativeOpen.apply(this, args);
  };

  const nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, value) {
    const lower = String(name).toLowerCase();
    if (['src','href','action','poster','data'].includes(lower)) value = proxify(value);
    return nativeSetAttribute.call(this, name, value);
  };

  const pairs = [
    [window.HTMLImageElement, 'src'],
    [window.HTMLScriptElement, 'src'],
    [window.HTMLIFrameElement, 'src'],
    [window.HTMLLinkElement, 'href'],
    [window.HTMLAnchorElement, 'href'],
    [window.HTMLFormElement, 'action'],
    [window.HTMLSourceElement, 'src'],
    [window.HTMLVideoElement, 'src'],
    [window.HTMLVideoElement, 'poster'],
    [window.HTMLAudioElement, 'src'],
    [window.HTMLObjectElement, 'data']
  ];
  for (const [ctor, prop] of pairs) if (ctor?.prototype) patch(ctor.prototype, prop);
})();`;

  return new Response(js, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-content-type-options': 'nosniff'
    }
  });
}
