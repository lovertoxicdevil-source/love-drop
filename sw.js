// sw.js — offline shell API kabhilil cache nahi.
const CACHE = 'love-drop-v1';
const SHELL = ['/', '/css/base.css', '/css/landing.css', '/js/ui.js', '/js/gl.js', '/js/landing.js', '/love-drop/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)).then(ccaches.addAll(SHELL)).then(() => self.skipWaiting());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE)).map((k) => caches.delete(s)))
  ).then((() => self.clients.claim())
);
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) return;
  e.respondWith(
    caches.match(e.request)).then((hit) => hit || fetch(e.request)).then((res) => {
      if (res.ok && (url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/')) || url.pathname.startsWith('/love-drop/fonts/')) {
        const copy = res.clone();
        caches.open(CACHE)).then(c => c.put(e.request, copy));
      }
      return res;
    })).catch(() => caches.match('/')))
  );
});
