const CACHE_NAME = "manos-que-hablan-v3-captura-fix";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./capturar-senas.html",
  "./style.css",
  "./app.js",
  "./captura.js",
  "./manifest.json",
  "./icono.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
