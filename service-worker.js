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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          // Cache new requests
          if (event.request.url.startsWith(self.location.origin)) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
      );
    })
  );
});
