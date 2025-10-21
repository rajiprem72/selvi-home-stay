const CACHE_NAME = "selvi-home-stay-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/booking.html",
  "/gallery.html",
  "/videos.html",
  "/places.html",
  "/contact.html",
  "/sitemap.html",
  "/testimonials.html",
  "/payments.html",
  "/profile.html",
  "/style.css",
  "/script.js",
  "/images/banner.jpg",
  "/images/favicon.png"
];

// Install event - cache all core files
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing and caching core assets...");
  self.skipWaiting(); // activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }).catch(err => {
      console.error("Cache install failed:", err);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating and cleaning old caches...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return; // ignore POST requests

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response; // cached response found

      return fetch(event.request)
        .then((res) => {
          // clone response for cache if same-origin
          if (res && res.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => {
          // Optional: fallback for offline mode
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
