/* Holdem Lab service worker — 앱 파일을 저장해 오프라인에서도 열리게 함.
   파일을 고친 뒤 다시 올릴 때는 아래 VERSION을 바꾸세요. */
var VERSION = 'holdemlab-1.9.0';
var SHELL = [
  './', 'index.html', 'privacy.html', 'app.css', 'app.js', 'engine.js', 'i18n.js', 'guide.js', 'manifest.webmanifest',
  'fonts/IBMPlexMono-Regular-Latin1.woff2', 'fonts/IBMPlexMono-Medium-Latin1.woff2', 'fonts/IBMPlexMono-SemiBold-Latin1.woff2',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];
var CARD_CACHE = 'holdemlab-cards';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== CARD_CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Deck of Cards API JSON: always network (app falls back to local deck when offline)
  if (url.hostname === 'deckofcardsapi.com' && url.pathname.indexOf('/api/') === 0) return;
  // card images: cache after first view
  if (url.hostname === 'deckofcardsapi.com') {
    e.respondWith(caches.open(CARD_CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // app shell: cache first, refresh in background
  e.respondWith(caches.open(VERSION).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) { if (res.ok) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
