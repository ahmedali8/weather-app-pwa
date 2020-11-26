const CACHE_NAME = 'v1';
const assets = ['/index.html', '/offline.html'];

const self = this;

// install service worker
self.addEventListener('install', (e) => {
  console.log('service worker installed');
  e.waitUntil(
    // setting assets to cache
    caches.open(CACHE_NAME).then((cache) => {
      console.log('caching assets');

      return cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', (e) => {
  console.log('service worker activated');

  e.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);
      return Promise.all(
        keys
          // creating an array that should not contain our CACHE_NAME
          .filter((key) => key !== CACHE_NAME)
          // delete that array
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(() => {
      return fetch(e.request).catch(() => caches.match('offline.html'));
    })
  );
});
