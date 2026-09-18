// sw.js — offline shell. API kabhi cache nahi.
const CACHE = 'love-drop-v1';
const SHELL = ['/love-drop/', '/love-drop/css/base.css', '/love-drop/css/landing.css', '/love-drop/js/ui.js', '/love-drop/js/gl.js', '/love-drop/js/landing.js', '/love-drop/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && (url.pathname.startsWith('/love-drop/css/') || url.pathname.startsWith('/love-drop/js/') || url.pathname.startsWith('/love-drop/fonts/'))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('/love-drop/')))
  );
});
