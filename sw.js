// sw.js
const ROOT = new URL(self.registration.scope).pathname; // e.g. "/okno/"
const NOT_FOUND = ROOT + '404.html';
const CACHE = 'okno-404-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add(NOT_FOUND))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  // Only intercept full-page navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(res => {
        // If the server says "not found", serve our 404 instead
        if (res.status === 404) return caches.match(NOT_FOUND);
        return res;
      }).catch(() => caches.match(NOT_FOUND)) // offline/network error -> 404
    );
  }
});
